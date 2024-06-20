const express = require('express');
const router = express.Router();
const { pool } = require('../app');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

router.get('/register', (req, res) => {
  res.render('layouts/register', { layout: false });
});

router.get('/login', (req, res) => {
    res.render('layouts/login', { layout: false });
});

router.get('/nosotros', (req, res) => {
  res.render('layouts/nosotros', { layout: false });
});

router.get('/mas', (req, res) => {
  res.render('layouts/mas', { layout: false });
});

router.get('/datos', (req, res) => {
  res.render('layouts/datos', { layout: false });
});

router.get('/mantenimiento', (req, res) => {
  res.render('layouts/mantenimiento', { layout: false });
});

router.post('/register', async (req, res) => {
  const { nombre, contacto_de_confianza, clave, edad, peso, genero, estatura } = req.body;

  try {
    await pool.query('INSERT INTO usuario_info (username, edad, peso, altura, sexo, clave, num_emergencia) VALUES ($1, $2, $3, $4, $5, $6, $7)', [nombre, edad, peso, estatura, genero, clave, contacto_de_confianza]);
    console.log(`Usuario ${nombre} registrado con éxito.`);
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Hubo un error al crear el usuario');
  }
});

router.post('/login', async (req, res) => {
  const { nombre, clave } = req.body;

  const user = await pool.query('SELECT * FROM usuario_info WHERE username = $1', [nombre]);

  if (user.rows.length > 0 && clave === user.rows[0].clave) {
    req.session.isAuthenticated = true;
    req.session.username = nombre;
    res.redirect('/user_profile');
  } else {
    res.status(401).send('Nombre o clave incorrectos');
  }
});



module.exports = router;
