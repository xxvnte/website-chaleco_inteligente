import express from "express";
import { pool } from "../app.js";
import authenticate from "../middlewares/auth.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

async function getUserById(id) {
  try {
    const user = await pool.query(
      "SELECT * FROM usuario_info WHERE id_usuario = $1",
      [id]
    );
    return user.rows[0];
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    throw error;
  }
}

router.get("/datos/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const { userId } = req.session;

  if (parseInt(id, 10) !== parseInt(userId, 10)) {
    return res
      .status(403)
      .json({ error: "No tienes permiso para ver estos datos" });
  }

  try {
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const saludData = await pool.query(
      "SELECT frecuencia_cardiaca, oximetro, tiempo FROM datos_sensores WHERE id_usuario = $1",
      [id]
    );
    const gpsData = await pool.query(
      "SELECT latitud, longitud, fecha, tiempo FROM datos_sensores WHERE id_usuario = $1",
      [id]
    );

    res.json({
      user,
      saludData: saludData.rows,
      gpsData: gpsData.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Hubo un error al verificar el usuario" });
  }
});

router.post("/sensor_data", async (req, res) => {
  const {
    id_usuario,
    frecuencia_cardiaca,
    oximetro,
    latitud,
    longitud,
    fecha,
    tiempo,
  } = req.body;
  try {
    await pool.query(
      "INSERT INTO datos_sensores (id_usuario, frecuencia_cardiaca, oximetro, latitud, longitud, fecha, tiempo) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [
        id_usuario,
        frecuencia_cardiaca,
        oximetro,
        latitud,
        longitud,
        fecha,
        tiempo,
      ]
    );
    console.log("Datos del sensor recibidos con éxito para el usuario", {
      id_usuario,
    });
    res.status(200).send("Datos del sensor recibidos con éxito");
  } catch (error) {
    console.error("Error al recibir los datos del sensor:", error);
    res.status(500).send("Hubo un error al recibir los datos del sensor");
  }
});

router.get("/api/usuarioData", authenticate, async (req, res) => {
  const { userId } = req.session;
  console.log("User ID from session:", userId);
  try {
    const user = await getUserById(userId);
    console.log("User data:", user);
    res.json(user);
  } catch (error) {
    console.error("Error al obtener los datos del usuario:", error);
    res.status(500).send("Hubo un error al obtener los datos del usuario");
  }
});

router.get("/api/saludData", authenticate, async (req, res) => {
  const { userId } = req.session;
  console.log("User ID from session:", userId);
  try {
    const user = await getUserById(userId);
    console.log("User ID:", user.id_usuario);
    const saludData = await pool.query(
      "SELECT frecuencia_cardiaca, oximetro, tiempo FROM datos_sensores WHERE id_usuario = $1",
      [user.id_usuario]
    );

    console.log("Salud data:");
    console.table(saludData.rows);

    res.json(saludData.rows);
  } catch (error) {
    console.error("Error al obtener los datos de salud:", error);
    res.status(500).send("Hubo un error al obtener los datos de salud");
  }
});

router.get("/api/gpsData", authenticate, async (req, res) => {
  const { userId } = req.session;
  console.log("User ID from session:", userId);
  try {
    const user = await getUserById(userId);
    console.log("User ID:", user.id_usuario);
    const gpsData = await pool.query(
      "SELECT latitud, longitud, fecha, tiempo FROM datos_sensores WHERE id_usuario = $1",
      [user.id_usuario]
    );

    console.log("GPS data:");
    console.table(gpsData.rows);

    res.json(gpsData.rows);
  } catch (error) {
    console.error("Error al obtener los datos de GPS:", error);
    res.status(500).send("Hubo un error al obtener los datos de GPS");
  }
});

export default router;
