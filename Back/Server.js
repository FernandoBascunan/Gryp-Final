const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.json());
require('dotenv').config();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'GrypDB'
});

connection.connect(err => {
  if (err) {
    console.error('Error de conexión:', err);
    return;
  }
  console.log('Conectado a la base de datos');
});

// Crear nuevo usuario
app.post('/api/users', async (req, res) => {
  const { username, rut, email, phone, region, comuna, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO users (userName, rut, email, phone, region, commune, password) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection.query(query, [username, rut, email, phone, region, comuna, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error al crear el usuario:', err);
        return res.status(500).json({ error: 'Error al crear el usuario' });
      }
      res.status(201).json({ message: 'Usuario creado con éxito', userId: result.insertId });
    });
  } catch (error) {
    console.error('Error al encriptar la contraseña:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  }

  const query = 'SELECT * FROM users WHERE email = ?';

  connection.query(query, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    const user = results[0];
    try {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Email o contraseña incorrectos' });
      }
      const token = jwt.sign(
        { 
          id: user.userID, 
          email: user.email, 
          userName: user.userName, 
          phone: user.phone, 
          region: user.region, 
          rut: user.rut 
        },
        process.env.JWT_SECRET || 'tu_clave_secreta_temporal',
        { expiresIn: '2h' }
      );
      const { password: _, ...userWithoutPassword } = user;
      res.json({
        success: true,
        token,
        user: userWithoutPassword
      });
    } catch (error) {
      res.status(500).json({ error: 'Error durante la verificación' });
    }
  });
});

// Obtener perfil de usuario
app.get('/api/profile/:userID', (req, res) => {
  const userID = req.params.userID;
  const query = 'SELECT userName, rut, email, phone, region FROM users WHERE userID = ?';
  connection.query(query, [userID], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'No existen datos para cargar' });
    }
    res.status(200).json({ success: true, user: results[0] });
  });
});

// Obtener todas las mesas
app.get('/api/mesas', (req, res) => {
  const query = 'SELECT * FROM tables'; // Suponiendo que la tabla de mesas se llama "tables"
  
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.status(200).json({ success: true, mesas: results });
  });
});

app.put('/api/mesas/:id', (req, res) => {
  const mesaId = req.params.id;
  const { tableStatus } = req.body;

  // Asegúrate de que tableStatus sea 0 o 1
  if (tableStatus !== 0 && tableStatus !== 1) {
    return res.status(400).json({ error: 'El valor de tableStatus debe ser 0 o 1' });
  }

  const query = 'UPDATE tables SET tableStatus = ? WHERE tableID = ?';
  connection.query(query, [tableStatus, mesaId], (err, result) => {
    if (err) {
      console.error('Error al actualizar la disponibilidad de la mesa:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Mesa no encontrada' });
    }
    res.status(200).json({ success: true, message: 'Disponibilidad de la mesa actualizada' });
  });
});


// Agregar una nueva mesa
app.post('/api/mesas', (req, res) => {
  const { tableStatus, userID } = req.body; // Asumiendo que los valores de tableStatus (1 o 0) se pasan desde el cuerpo

  const query = 'INSERT INTO tables (tableStatus, userID) VALUES (?, ?)';
  connection.query(query, [tableStatus || 1, userID || null], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.status(201).json({ success: true, message: 'Mesa agregada con éxito', mesaId: result.insertId });
  });
});

// Eliminar una mesa
app.delete('/api/mesas/:id', (req, res) => {
  const mesaId = req.params.id;

  const query = 'DELETE FROM tables WHERE tableID = ?';
  connection.query(query, [mesaId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Mesa no encontrada' });
    }
    res.status(200).json({ success: true, message: 'Mesa eliminada' });
  });
});

// Obtener inventario del usuario
app.get('/api/inventario/:userID', (req, res) => {
  const userID = req.params.userID;
  const query = 'SELECT * FROM storage WHERE userID = ?';
  connection.query(query, [userID], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'No existen datos para cargar' });
    }
    res.status(200).json({ success: true, storage: results });
  });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
