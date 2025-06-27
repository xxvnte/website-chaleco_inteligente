import express from "express";
import sql from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import authenticate from "../middlewares/auth.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

async function getUserById(id) {
  try {
    const [user] = await sql`
      SELECT * FROM usuario_info WHERE id_usuario = ${id}
    `;
    return user;
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    throw error;
  }
}

router.post("/register", async (req, res) => {
  const { nombre, contacto_de_confianza, clave, edad, peso, genero, estatura } =
    req.body;

  try {
    const hashedPassword = await bcrypt.hash(clave, 10);

    const [result] = await sql`
      INSERT INTO usuario_info 
        (username, edad, peso, altura, sexo, clave, num_emergencia) 
      VALUES 
        (${nombre}, ${edad}, ${peso}, ${estatura}, ${genero}, ${hashedPassword}, ${contacto_de_confianza}) 
      RETURNING id_usuario
    `;

    const userId = result.id_usuario;
    console.log(`Usuario ${nombre} registrado con éxito.`);
    res.status(200).send("Cuenta creada");
  } catch (error) {
    console.error(error);
    res.status(500).send("Hubo un error al crear el usuario");
  }
});

router.post("/login", async (req, res) => {
  const { nombre, clave } = req.body;

  try {
    const user = await sql`
      SELECT * FROM usuario_info WHERE username = ${nombre}
    `;

    console.log("Usuario encontrado:", user);

    if (user.length > 0) {
      const usuario = user[0];

      if (await bcrypt.compare(clave, usuario.clave)) {
        const token = jwt.sign(
          { id: usuario.id_usuario },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        console.log(`Usuario ${nombre} ha iniciado sesión con éxito.`);
        console.log("Token generado:", token);

        res.cookie("token", token, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        });

        req.session.isAuthenticated = true;
        req.session.userId = usuario.id_usuario;
        res.json({ success: true, userId: usuario.id_usuario });
      } else {
        res.status(401).send("Nombre o clave incorrectos");
      }
    } else {
      res.status(404).send("No hay usuarios registrados");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Hubo un error al iniciar sesión");
  }
});

router.get("/user_profile/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  if (parseInt(id, 10) !== parseInt(req.user.id, 10)) {
    return res.status(403).send("No tienes permiso para ver estos datos");
  }

  try {
    const user = await getUserById(id);
    if (user) {
      console.log("Usuario encontrado:", user);
      return res.json(user);
    } else {
      throw new Error("Usuario no encontrado");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Hubo un error al verificar el usuario");
  }
});

router.get("/edit_user/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await getUserById(id);
    if (user) {
      console.log("Usuario encontrado para editar:", user);
      return res.json(user);
    } else {
      return res.status(404).send("Usuario no encontrado");
    }
  } catch (error) {
    console.error("Error al obtener el usuario para editar:", error);
    res.status(500).send("Hubo un error al obtener el usuario para editar");
  }
});

router.post("/update_user/:id", authenticate, async (req, res) => {
  const { username, num_emergencia, clave, edad, peso, altura } = req.body;
  const { id } = req.params;

  try {
    const [user] = await sql`
      SELECT sexo FROM usuario_info WHERE id_usuario = ${id}
    `;
    const genero = user?.sexo;

    let hashedPassword = null;
    if (clave) {
      hashedPassword = await bcrypt.hash(clave, 10);
    }

    await sql`
      UPDATE usuario_info SET 
        username = ${username}, 
        num_emergencia = ${num_emergencia}, 
        clave = COALESCE(${hashedPassword}, clave), 
        edad = ${edad}, 
        peso = ${peso}, 
        sexo = ${genero}, 
        altura = ${altura}
      WHERE id_usuario = ${id}
    `;

    res.json({ message: "Perfil actualizado" });
  } catch (error) {
    console.error("Error al actualizar el perfil del usuario:", error);
    res.status(500).send("Hubo un error al actualizar el perfil");
  }
});

router.post("/logout", authenticate, (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("token");
    res.status(200).send("Sesión cerrada");
  });
});

router.post("/delete_user/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const { userId } = req.session;

  if (parseInt(id, 10) !== parseInt(userId, 10)) {
    return res.status(403).send("No tienes permiso para eliminar este usuario");
  }

  try {
    await sql`DELETE FROM datos_sensores WHERE id_usuario = ${id}`;
    await sql`DELETE FROM usuario_info WHERE id_usuario = ${id}`;

    req.session.destroy(() => {
      res.clearCookie("token");
      res.status(200).send("Cuenta eliminada");
    });
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    res.status(500).send("Hubo un error al eliminar el usuario");
  }
});

export default router;
