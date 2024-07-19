const express = require('express');
const router = express.Router();
const { pool } = require('../app');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authenticate = require('../middlewares/auth');

require('dotenv').config();

async function getUserById(id) {
  try {
    const user = await pool.query('SELECT * FROM usuario_info WHERE id_usuario = $1', [id]);
    return user.rows[0];
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    throw error;
  }
}

router.get('/register', (req, res) => {
  res.render('layouts/register', { layout: false });
});

router.get('/login', (req, res) => {
    res.render('layouts/login', { layout: false });
});

router.get('/register', (req, res) => {
  res.render('layouts/register', { layout: false });
});

router.get('/login', (req, res) => {
  res.render('layouts/login', { layout: false });
});

router.post('/register', async (req, res) => {
  const { nombre, contacto_de_confianza, clave, edad, peso, genero, estatura } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(clave, 10);
    const result = await pool.query('INSERT INTO usuario_info (username, edad, peso, altura, sexo, clave, num_emergencia) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id_usuario', [nombre, edad, peso, estatura, genero, hashedPassword, contacto_de_confianza]);
    const userId = result.rows[0].id_usuario;
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

  if (user.rows.length > 0) {
    if (await bcrypt.compare(clave, user.rows[0].clave)) {
      const token = jwt.sign({ id: user.rows[0].id_usuario }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      });

      req.session.isAuthenticated = true;
      req.session.userId = user.rows[0].id_usuario;
      res.redirect(`/user_profile/${user.rows[0].id_usuario}`);
    } else {
      res.status(401).send('Nombre o clave incorrectos');
    }
  } else {
    res.status(404).send('No hay usuarios registrados');
  }
});

router.get('/user_profile/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { userId } = req.session;

  if (parseInt(id, 10) !== parseInt(userId, 10)) {
    return res.status(403).send('No tienes permiso para ver estos datos');
  }

  try {
    const user = await getUserById(id);
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

router.get('/edit_user/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await getUserById(id);
    res.render('layouts/edit_user', { user, layout: false });
  } catch (error) {
    console.error('Error al obtener el usuario para editar:', error);
    res.status(500).send('Hubo un error al obtener el usuario para editar');
  }
});

router.post('/update_user/:id', authenticate, async (req, res) => {
  const { nombre, contacto_de_confianza, clave, edad, peso, estatura } = req.body;
  const { id } = req.params;

  try {
    const user = await pool.query('SELECT sexo FROM usuario_info WHERE id_usuario = $1', [id]);
    const genero = user.rows[0].sexo;

    let hashedPassword;
    if (clave) {
      hashedPassword = await bcrypt.hash(clave, 10);
    }

    await pool.query(
      'UPDATE usuario_info SET username = $2, num_emergencia = $3, clave = COALESCE($4, clave), edad = $5, peso = $6, sexo = $7, altura = $8 WHERE id_usuario = $1', 
      [id, nombre, contacto_de_confianza, hashedPassword, edad, peso, genero, estatura]
    );

    req.session.destroy((err) => {
      if (err) {
        return console.log(err);
      }
    });

    res.redirect('/login');
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).send('Hubo un error al actualizar el usuario');
  }
});

router.post('/logout', authenticate, (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('token');
    res.redirect('/login');
  });
});

router.post('/delete_user/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { userId } = req.session;

  if (parseInt(id, 10)!== parseInt(userId, 10)) {
    return res.status(403).send('No tienes permiso para eliminar este usuario');
  }

  try {
    await pool.query('DELETE FROM datos_sensores WHERE id_usuario = $1', [id]);
    await pool.query('DELETE FROM usuario_info WHERE id_usuario = $1', [id]);

    req.session.destroy(() => {
      res.clearCookie('token');
      res.redirect('/login');
    });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).send('Hubo un error al eliminar el usuario');
  }
});

module.exports = router;

