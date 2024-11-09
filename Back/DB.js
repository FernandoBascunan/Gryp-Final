const mysql=require("mysql2");

connection= mysql.createConnection({
        host: 'localhost',   
        user: 'root',       
        password: '', 
        database: 'grypdb' 
});

connection.connect((err) => {
    if (err) {
        console.error('Error conectando a MySQL:', err);
        return;
    }
    console.log('Conexión exitosa a MySQL');
});

module.exports = connection;