import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;
const sql = postgres(connectionString);

sql`SELECT NOW()`
  .then(() => {
    console.log("Conexión a la base de datos exitosa");
  })
  .catch((error) => {
    console.error("Error al conectar a la base de datos:", error);
  });

export default sql;
