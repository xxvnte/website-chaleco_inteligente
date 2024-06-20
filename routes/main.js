const express = require('express');
const router = express.Router();
const { pool } = require('../app');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middlewares/authJwt');

async function getUserByUsername(username) {
  try {
    const user = await pool.query('SELECT * FROM usuario_info WHERE username = $1', [username]);
    return user.rows[0];
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    throw error;
  }
}

router.get('/', (req, res) => {
  res.render('layouts/index', { layout: false });
});

router.get('/user_profile', async (req, res) => {
  const { username } = req.session;
  
  try {
    const user = await getUserByUsername(username);
    if (user) {
      res.render('layouts/user_profile', { user: user, layout: false });
    } else {
      throw new Error('Usuario no encontrado');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Hubo un error al verificar el usuario');
  }
});

router.get('/edit_user', async (req, res) => {
  const { username } = req.session;
  try {
    const user = await getUserByUsername(username);
    res.render('layouts/edit_user', { user, layout: false });
  } catch (error) {
    console.error('Error al obtener el usuario para editar:', error);
    res.status(500).send('Hubo un error al obtener el usuario para editar');
  }
});

router.post('/update_user', async (req, res) => {
  const { nombre, contacto_de_confianza, clave, edad, peso, estatura } = req.body;
  const { username } = req.session;

  try {
    const user = await pool.query('SELECT sexo FROM usuario_info WHERE username = $1', [username]);
    const genero = user.rows[0].sexo;

    await pool.query('UPDATE usuario_info SET username = $2, num_emergencia = $3, clave = $4, edad = $5, peso = $6, sexo = $7, altura = $8 WHERE username = $1', [username, nombre, contacto_de_confianza, clave, edad, peso, genero, estatura]);

    req.session.destroy((err) => {
      if(err) {
        return console.log(err);
      }
    });

    res.redirect('/login');
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).send('Hubo un error al actualizar el usuario');
  }
});

router.post('/delete_user', async (req, res) => {
  const { username } = req.session;
  try {
    const user = await pool.query('SELECT id_usuario FROM usuario_info WHERE username = $1', [username]);
    const id_usuario = user.rows[0].id_usuario;

    await pool.query('DELETE FROM datos_sensores WHERE id_usuario = $1', [id_usuario]);

    await pool.query('DELETE FROM usuario_info WHERE username = $1', [username]);

    req.session.destroy();

    res.redirect('/login');
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).send('Hubo un error al eliminar el usuario');
  }
});


router.post('/sensor_data', async (req, res) => {
  const { id_usuario, frecuencia_cardiaca, oximetro, latitud, longitud, fecha, tiempo } = req.body;
  try {
    await pool.query('INSERT INTO datos_sensores (id_usuario, frecuencia_cardiaca, oximetro, latitud, longitud, fecha, tiempo) VALUES ($1, $2, $3, $4, $5, $6, $7)', [id_usuario, frecuencia_cardiaca, oximetro, latitud, longitud, fecha, tiempo]);
    console.log(`Datos del sensor recibidos con éxito para el usuario ${id_usuario}`);
    res.status(200).send('Datos del sensor recibidos con éxito');
  } catch (error) {
    console.error('Error al recibir los datos del sensor:', error);
    res.status(500).send('Hubo un error al recibir los datos del sensor');
  }
});

router.get('/api/usuarioData', async (req, res) => {
  const { username } = req.session;
  console.log('Username from session:', username); // Log para verificar el username
  try {
    const user = await getUserByUsername(username);
    console.log('User data:', user); // Log para verificar los datos del usuario
    res.json(user);
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error);
    res.status(500).send('Hubo un error al obtener los datos del usuario');
  }
});

router.get('/api/saludData', async (req, res) => {
  const { username } = req.session;
  console.log('Username from session:', username); 
  try {
    const user = await getUserByUsername(username);
    console.log('User ID:', user.id_usuario); 
    const saludData = await pool.query('SELECT frecuencia_cardiaca, oximetro, tiempo FROM datos_sensores WHERE id_usuario = $1', [user.id_usuario]);

    console.log('Salud data:');
    console.table(saludData.rows);

    res.json(saludData.rows);
  } catch (error) {
    console.error('Error al obtener los datos de salud:', error);
    res.status(500).send('Hubo un error al obtener los datos de salud');
  }
});

router.get('/api/gpsData', async (req, res) => {
  const { username } = req.session;
  console.log('Username from session:', username);
  try {
    const user = await getUserByUsername(username);
    console.log('User ID:', user.id_usuario);
    const gpsData = await pool.query('SELECT latitud, longitud, fecha, tiempo FROM datos_sensores WHERE id_usuario = $1', [user.id_usuario]);

    console.log('GPS data:');
    console.table(gpsData.rows);

    res.json(gpsData.rows);
  } catch (error) {
    console.error('Error al obtener los datos de GPS:', error);
    res.status(500).send('Hubo un error al obtener los datos de GPS');
  }
});

module.exports = router;
