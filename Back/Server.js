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
  console.log('\n--- Inicio de proceso de login ---');
  console.log('Email recibido:', email);

  if (!email || !password) {
    console.log('Error: Faltan credenciales');
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  }

  const query = 'SELECT * FROM users WHERE email = ?';

  connection.query(query, [email], async (err, results) => {
    if (err) {
      console.error('Error en consulta SQL:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    if (results.length === 0) {
      console.log('Usuario no encontrado');
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    const user = results[0];
    console.log('Usuario encontrado:', {
      id: user.userID,
      email: user.email,
      storedHash: user.password
    });

    try {
      const testHash = await bcrypt.hash(password, 10);
      console.log('Hash de prueba generado:', testHash);
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log('Contraseña ingresada:', password);
      console.log('Hash almacenado:', user.password);
      console.log('¿Contraseña válida?:', isPasswordValid);

      if (!isPasswordValid) {
        console.log('Validación de contraseña fallida');
        return res.status(401).json({ error: 'Email o contraseña incorrectos' });
      }
      const token = jwt.sign(
        { id: user.userID, email: user.email },
        process.env.JWT_SECRET || 'tu_clave_secreta_temporal',
        { expiresIn: '2h' }
      );

      console.log('Login exitoso - Token generado');
      const { password: _, ...userWithoutPassword } = user;
      res.json({
        success: true,
        token,
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Error durante la verificación:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
});

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

app.get('/api/inventario/:userID', (req, res) => {
  const userID = req.params.userID;
  const query = 'SELECT * from storage where userID = ?';
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