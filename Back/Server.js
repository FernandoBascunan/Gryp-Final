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

const handleCrudOperation = (operation, table, req, res) => {
    const { id } = req.params;
    const { body } = req;

    if (operation === 'GET_ALL') {
        connection.query(`SELECT * FROM ${table}`, (err, results) => {
            if (err) {
                res.status(500).json({ error: `Error al obtener datos de ${table}` });
            } else {
                res.json(results);
            }
        });
    } else if (operation === 'GET_ONE' && id) {
        connection.query(`SELECT * FROM ${table} WHERE id = ?`, [id], (err, results) => {
            if (err) {
                res.status(500).json({ error: `Error al obtener el elemento con id ${id} de ${table}` });
            } else if (results.length === 0) {
                res.status(404).json({ error: `${table} no encontrado` });
            } else {
                res.json(results[0]);
            }
        });
    } else if (operation === 'CREATE') {
        const columns = Object.keys(body).join(', ');
        const values = Object.values(body);
        const placeholders = values.map(() => '?').join(', ');

        connection.query(`INSERT INTO ${table} (${columns}) VALUES (${placeholders})`, values, (err, result) => {
            if (err) {
                res.status(500).json({ error: `Error al crear ${table}` });
            } else {
                res.status(201).json({ id: result.insertId, ...body });
            }
        });
    } else if (operation === 'UPDATE' && id) {
        const columns = Object.keys(body);
        const values = Object.values(body);

        const setClause = columns.map(col => `${col} = ?`).join(', ');
        values.push(id);

        connection.query(`UPDATE ${table} SET ${setClause} WHERE id = ?`, values, (err, result) => {
            if (err) {
                res.status(500).json({ error: `Error al actualizar ${table} con id ${id}` });
            } else if (result.affectedRows === 0) {
                res.status(404).json({ error: `${table} no encontrado` });
            } else {
                res.json({ message: `${table} actualizado correctamente` });
            }
        });
    } else if (operation === 'DELETE' && id) {
        connection.query(`DELETE FROM ${table} WHERE id = ?`, [id], (err, result) => {
            if (err) {
                res.status(500).json({ error: `Error al eliminar ${table} con id ${id}` });
            } else if (result.affectedRows === 0) {
                res.status(404).json({ error: `${table} no encontrado` });
            } else {
                res.json({ message: `${table} eliminado correctamente` });
            }
        });
    } else {
        res.status(400).json({ error: 'Operación no válida' });
    }

};


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

app.get('/api/:table', (req, res) => {
    handleCrudOperation('GET_ALL', req.params.table, req, res);
});

app.get('/api/:table/:id', (req, res) => {
    handleCrudOperation('GET_ONE', req.params.table, req, res);
});

app.post('/api/:table', (req, res) => {
    handleCrudOperation('CREATE', req.params.table, req, res);
});

app.put('/api/:table/:id', (req, res) => {
    handleCrudOperation('UPDATE', req.params.table, req, res);
});

app.delete('/api/:table/:id', (req, res) => {
    handleCrudOperation('DELETE', req.params.table, req, res);
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
