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





















// MESAS API



// Obtener todas las mesas
app.get('/api/mesas', (req, res) => {
  const query = 'SELECT * FROM tables';
  
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.status(200).json({ success: true, mesas: results });
  });
});
// Editar Mesas
app.put('/api/mesas/:id', (req, res) => {
  const mesaId = req.params.id;
  const { tableStatus } = req.body;

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

// Crear mesa
app.post('/api/mesas', (req, res) => {
  const { tableStatus, userID } = req.body; 

  const query = 'INSERT INTO tables (tableStatus, userID) VALUES (?, ?)';
  connection.query(query, [tableStatus || 1, userID || null], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.status(201).json({ success: true, message: 'Mesa agregada con éxito', mesaId: result.insertId });
  });
});

// Eliminar mesa
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






























// ORDENES API






// Obtener todas las órdenes 
app.get('/api/orders', (req, res) => {
  const query = `
    SELECT 
      o.orderID,
      o.waiterID,
      o.tableID,
      o.userID,
      w.waiterName,
      GROUP_CONCAT(DISTINCT m.dishName) as dishes
    FROM orders o
    INNER JOIN waiter w ON o.waiterID = w.waiterID
    INNER JOIN tables t ON o.tableID = t.tableID
    LEFT JOIN orderContent oc ON o.orderID = oc.orderID
    LEFT JOIN menu m ON oc.menuID = m.menuID
    WHERE m.dishStatus = true
    GROUP BY o.orderID
    ORDER BY o.orderID DESC
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener órdenes:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    const formattedResults = results.map(order => ({
      ...order,
      dishes: order.dishes ? order.dishes.split(',') : []
    }));

    res.json({ success: true, orders: formattedResults });
  });
});

// Crear orden
app.post('/api/orders', (req, res) => {
  const { waiterID, tableID, userID, menuItems } = req.body;

  if (!waiterID || !tableID || !userID || !Array.isArray(menuItems)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Datos incompletos o inválidos' 
    });
  }
  connection.beginTransaction(err => {
    if (err) {
      return res.status(500).json({ error: 'Error al iniciar la transacción' });
    }
    const orderQuery = `
      INSERT INTO orders (waiterID, tableID, userID) 
      VALUES (?, ?, ?)
    `;
    connection.query(orderQuery, [waiterID, tableID, userID], (err, result) => {
      if (err) {
        return connection.rollback(() => {
          res.status(500).json({ error: 'Error al crear la orden' });
        });
      }
      const orderID = result.insertId;
      if (menuItems.length === 0) {
        return connection.commit(err => {
          if (err) {
            return connection.rollback(() => {
              res.status(500).json({ error: 'Error al confirmar la transacción' });
            });
          }
          res.json({ success: true, orderID });
        });
      }
      const itemsQuery = `
        INSERT INTO orderContent (orderID, menuID, userID) 
        VALUES ?
      `;
    
      const itemValues = menuItems.map(menuID => [orderID, menuID, userID]);
      connection.query(itemsQuery, [itemValues], (err) => {
        if (err) {
          return connection.rollback(() => {
            res.status(500).json({ error: 'Error al agregar los platos' });
          });
        }
        connection.commit(err => {
          if (err) {
            return connection.rollback(() => {
              res.status(500).json({ error: 'Error al confirmar la transacción' });
            });
          }
          res.json({ success: true, orderID });
        });
      });
    });
  });
});

// Editar orden
app.put('/api/orders/:orderID', (req, res) => {
  const orderID = req.params.orderID;
  const { waiterID, tableID, userID, menuItems } = req.body;
  if (!waiterID || !tableID || !userID || !Array.isArray(menuItems)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Datos incompletos o inválidos' 
    });
  }
  connection.beginTransaction(err => {
    if (err) {
      return res.status(500).json({ error: 'Error al iniciar la transacción' });
    }
    const orderQuery = `
      UPDATE orders 
      SET waiterID = ?, tableID = ?, userID = ? 
      WHERE orderID = ?
    `;
    connection.query(orderQuery, [waiterID, tableID, userID, orderID], (err) => {
      if (err) {
        return connection.rollback(() => {
          res.status(500).json({ error: 'Error al actualizar la orden' });
        });
      }
      const deleteQuery = `
        DELETE FROM orderContent 
        WHERE orderID = ?
      `;
      connection.query(deleteQuery, [orderID], (err) => {
        if (err) {
          return connection.rollback(() => {
            res.status(500).json({ error: 'Error al actualizar los platos' });
          });
        }
        if (menuItems.length === 0) {
          return connection.commit(err => {
            if (err) {
              return connection.rollback(() => {
                res.status(500).json({ error: 'Error al confirmar la transacción' });
              });
            }
            res.json({ success: true, message: 'Orden actualizada con éxito' });
          });
        }
        const itemsQuery = `
          INSERT INTO orderContent (orderID, menuID, userID) 
          VALUES ?
        `;
        const itemValues = menuItems.map(menuID => [orderID, menuID, userID]);
        connection.query(itemsQuery, [itemValues], (err) => {
          if (err) {
            return connection.rollback(() => {
              res.status(500).json({ error: 'Error al agregar los platos' });
            });
          }
          connection.commit(err => {
            if (err) {
              return connection.rollback(() => {
                res.status(500).json({ error: 'Error al confirmar la transacción' });
              });
            }
            res.json({ success: true, message: 'Orden actualizada con éxito' });
          });
        });
      });
    });
  });
});
// Eliminar orden
app.delete('/api/orders/:orderID', (req, res) => {
  const orderID = req.params.orderID;
  const query = 'DELETE FROM orders WHERE orderID = ?';
  
  connection.query(query, [orderID], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al eliminar la orden' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }
    res.json({ success: true, message: 'Orden eliminada con éxito' });
  });
});
// Obtener menú para el desplegable
app.get('/api/menu', (req, res) => {
  const query = `
    SELECT menuID, dishName, dishStatus
    FROM menu 
    WHERE dishStatus = true
    ORDER BY dishName
  `;

  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener el menú' });
    }
    res.json({ success: true, menu: results });
  });
});
// Obtener meseros para el desplegable
app.get('/api/waiters', (req, res) => {
  const query = `
    SELECT waiterID, waiterName 
    FROM waiter 
    ORDER BY waiterName
  `;

  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener los meseros' });
    }
    res.json({ success: true, waiters: results });
  });
});
// Obtener mesas para el desplegable
app.get('/api/tables', (req, res) => {
  const query = `
    SELECT tableID, tableNumber 
    FROM tables 
    ORDER BY tableNumber
  `;

  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener las mesas' });
    }
    res.json({ success: true, tables: results });
  });
});























// INVENTARIO API


// Obtener inventario
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
// Eliminar Item
app.delete('/api/inventario/:id', (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM storage WHERE productID = ?';
  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }
    res.json({ success: true, message: 'Item eliminado con éxito' });
  });
});
// Editar item
app.put('/api/inventario/:id', (req, res) => {
  const id = req.params.id;
  const { pType, loc, pName, amount, unit } = req.body;
  const query = 'UPDATE storage SET productType = ?, loc = ?, productName = ?, amount = ?, unit = ? WHERE productID = ?';
  connection.query(query, [pType, loc, pName, amount, unit, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }
    res.json({ success: true, message: 'Item modificado con éxito' });
  });
});
// Agregar item
app.post('/api/inventario/:id', (req, res) => {
  const id = req.params.id;
  const { pType, loc, pName, amount, unit } = req.body;
  const query = 'INSERT INTO storage (productType, loc, productName, amount, unit, userID) VALUES (?, ?, ?, ?, ?, ?)';
  connection.query(query, [pType, loc, pName, amount, unit, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.json({ success: true, message: 'Item agregado correctamente' });
  });
});











// TRABAJADORES API

// Obtener trabajadores 
app.get('/api/workers/:userID', (req, res) => {
  const userID = req.params.userID;
  const query = `
    SELECT waiter.waiterID, waiter.waiterName, waiter.wRut, waiter.wPhone
    FROM waiter
    JOIN workers ON waiter.waiterID = workers.waiterID
    WHERE workers.userID = ?;
  `;
  connection.query(query, [userID], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error en el servidor', details: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'No existen datos para cargar' });
    }
    res.status(200).json({ success: true, workers: results });
  });
});
// Crear Trabajador
app.post('/api/workers/:userID', (req, res) => {
  const userID = req.params.userID;
  const { waiterName, wRut, wPhone } = req.body;

  if (!waiterName || !wRut || !wPhone) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  const insertWaiterQuery = `
    INSERT INTO waiter (waiterName, wRut, wPhone) 
    VALUES (?, ?, ?);
  `;
  
  connection.query(insertWaiterQuery, [waiterName, wRut, wPhone], (err, waiterResult) => {
    if (err) {
      return res.status(500).json({ error: 'Error al crear el trabajador', details: err.message });
    }

    const waiterID = waiterResult.insertId;

    const insertWorkerQuery = `
      INSERT INTO workers (userID, waiterID) 
      VALUES (?, ?);
    `;

    connection.query(insertWorkerQuery, [userID, waiterID], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error al asociar el trabajador con el usuario', details: err.message });
      }

      res.status(201).json({ success: true, message: 'Trabajador creado y asociado exitosamente', waiterID });
    });
  });
});
// Eliminar Trabajador 
app.delete('/api/workers/:waiterID', (req, res) => {
  const waiterID = req.params.waiterID;

  // Eliminar la relación en la tabla workers
  const deleteWorkerQuery = `
    DELETE FROM workers WHERE waiterID = ?;
  `;

  connection.query(deleteWorkerQuery, [waiterID], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error al eliminar la relación del trabajador', details: err.message });
    }

    // Eliminar al trabajador de la tabla waiter
    const deleteWaiterQuery = `
      DELETE FROM waiter WHERE waiterID = ?;
    `;

    connection.query(deleteWaiterQuery, [waiterID], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error al eliminar al trabajador', details: err.message });
      }

      res.status(200).json({ success: true, message: 'Trabajador eliminado exitosamente' });
    });
  });
});

















// MENU API 

// Obtener Menu
app.get('/api/menu/:userID', (req, res) => {
  const userID = req.params.userID;
  const query = 'SELECT * FROM menu WHERE userID = ?';
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

// Agregar Menu
app.post('/api/menu/:id', (req, res) => {
  const id = req.params.id;
  const { dishName,dishStatus} = req.body;
  const query = 'INSERT INTO menu (dishName,dishStatus, userID) VALUES (?, ?, ?)';
  connection.query(query, [dishName,dishStatus, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.json({ success: true, message: 'Item agregado correctamente' });
  });
});


// Eliminar Menu 
app.delete('/api/menu/:id', (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM menu WHERE productID = ?';
  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }
    res.json({ success: true, message: 'Item eliminado con éxito' });
  });
});
// Editar disponibilidad Menu

app.put('/api/menu/:id', (req, res) => {
  const menuId = req.params.id;
  const { menuStatus } = req.body;

  if (tableStatus !== 0 && tableStatus !== 1) {
    return res.status(400).json({ error: 'El valor de tableStatus debe ser 0 o 1' });
  }

  const query = 'UPDATE menu SET dishStatus = ? WHERE menuID = ?';
  connection.query(query, [tableStatus, mesaId], (err, result) => {
    if (err) {
      console.error('Error al actualizar la disponibilidad del menu:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Mesa no encontrada' });
    }
    res.status(200).json({ success: true, message: 'Disponibilidad del menu actualizado' });
  });
});










app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
