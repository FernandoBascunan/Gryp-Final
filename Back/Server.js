
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
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
app.post('/api/users', (req, res) => {
  const { username, rut, email, phone, region, comuna, password } = req.body;
  const query = 'INSERT INTO users (userName, rut, email, phone, region, commune, password) VALUES (?, ?, ?, ?, ?, ?, ?)';
  connection.query(query, [username, rut, email, phone, region, comuna, password], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al crear el usuario' });
    }
    res.status(201).json({ message: 'Usuario creado con éxito', userId: result.insertId });
  });
});

// Iniciar sesión y generar token JWT
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT userID, userName, rut, email, phone, region FROM users WHERE email = ? AND password = ?';
  
  connection.query(query, [email, password], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    
    if (results.length === 0) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }
    
    const user = results[0]; // Accede al primer resultado

    console.log('Datos del usuario antes de generar el token:', user); // Verifica el contenido de `user`

    // Genera el token con todos los datos necesarios
    const token = jwt.sign(
      {
        id: user.userID,
        userName: user.userName,
        rut: user.rut,
        email: user.email,
        phone: user.phone,
        region: user.region
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );
    console.log(user);
    console.log('Token generado:', token);
    res.json({
      success: true,
      token,
      user: {
        id: user.userID,
        userName: user.userName,
        rut: user.rut,
        email: user.email,
        phone: user.phone,
        region: user.region
      }
    });
  });
});

app.get('/api/profile/:userID', (req, res) => {
  const userID = req.params.userID; // Obtener el userID de los parámetros de la URL
  const query = 'SELECT userName, rut, email, phone, region FROM users WHERE userID = ?';
  connection.query(query, [userID], (err, results) => {
      if (err) {
          return res.status(500).json({ error: 'Error en el servidor' });
      }
      if (results.length === 0) {
          return res.status(404).json({ error: 'No existen datos para cargar' });
      }
      // Enviar los datos del usuario como respuesta
      res.status(200).json({ success: true, user: results[0] });
  });
});






app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
