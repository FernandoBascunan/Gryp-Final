const mysql = require('mysql');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'GrypDB'
});

// Conectar a la base de datos
connection.connect(err => {
  if (err) {
    console.error('Error de conexión:', err);
    return;
  }
  console.log('Conectado a la base de datos');
});

// Función para actualizar los datos de John Doe
const updateJohn = async () => {
  // Datos a actualizar
  const userID = 1; // ID del usuario de John Doe
  const userName = "John Doe";
  const rut = "12345678-9";
  const email = "johndoe@example.com";
  const phone = "+56912345678";
  const region = "Santiago";
  const commune = "Santiago Centro";
  const password = "password123"; // Nueva contraseña

  try {
    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Contraseña encriptada:', hashedPassword);

    // Consulta SQL para actualizar los datos del usuario
    const query = `
      UPDATE users 
      SET userName = ?, rut = ?, email = ?, phone = ?, region = ?, commune = ?, password = ?
      WHERE userID = ?
    `;

    connection.query(
      query,
      [userName, rut, email, phone, region, commune, hashedPassword, userID],
      (err, result) => {
        if (err) {
          console.error('Error al actualizar el perfil:', err);
          return;
        }

        if (result.affectedRows === 0) {
          console.log('Usuario no encontrado');
          return;
        }

        console.log('Perfil de John Doe actualizado con éxito');
        connection.end();
      }
    );
  } catch (error) {
    console.error('Error al encriptar la contraseña:', error);
  }
};

// Ejecutar la función
updateJohn();
