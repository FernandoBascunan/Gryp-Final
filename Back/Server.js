
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
    
    const user = results[0];
    const token = jwt.sign({ id: user.userID}, process.env.JWT_SECRET, { expiresIn: '2h' });
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








app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
