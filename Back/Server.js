const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;


app.use(cors());
app.use(bodyParser.json());

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


app.post('/api/users', (req, res) => {
    const { username, rut, email, phone, region, comuna, password } = req.body;
    const query = 'INSERT INTO users (userName, rut, email, Phone, region, commune, password) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection.query(query, [username, rut, email, phone, region, comuna, password], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Error al crear el usuario' });
      }
      res.status(201).json({ message: 'Usuario creado con éxito', userId: result.insertId });
    });
  });


  app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    const query = 'SELECT userID, userName, email FROM users WHERE email = ? AND password = ?';
    
    connection.query(query, [email, password], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        
        if (results.length === 0) {
            return res.status(401).json({ error: 'Email o contraseña incorrectos' });
        }
        
        // No enviar la contraseña al frontend
        const user = results[0];
        res.json({ 
            success: true,
            user: {
                id: user.userID,
                userName: user.userName,
                rut: user.rut,
                email: user.email,
                phone: user.Phone,
                region: user.region

            }
        });
    });
});

app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const user = users.find(u => u.id === userId);

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'Usuario no encontrado' });
  }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
