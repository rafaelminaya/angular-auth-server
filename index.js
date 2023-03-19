// importación del paquete express
const express = require("express");
const cors = require("cors");
const { dbConnection } = require("./database/config");
// Opción para controlar la ubicación de nuestros archivos del proyecto actual
const path = require("path");
// El paquete instalado "dotenv" (visible en el archivo "package.json") tiene una configuración por defecto que lee el archivo llamado ".env"
// config() : Permite leer el archivo ".env" al momento de cargar la aplicación. Con el fin de añadir su contenido como variables de entorno
require("dotenv").config();

// creamos el servidor/aplicación de express
const app = express();

// CONECIÓN A LA BASE DE DATOS
dbConnection();

// DIRECOTRIO PUBLICO -
// Pasaremos la configuración de la ruta a los archivos estáticos de la carpeta "public"
// De esta forma podremos cargar la página "index.html" en la raíz del servidor con una petición GET
app.use(express.static("public"));

// CORS
app.use(cors());

// middleware para lectura y parseo del body
// Indicamos que se espera peticiones de formato json
app.use(express.json());

// RUTAS
/*
 use() : Método que representa el uso de un middleware
- Primer argumento es el nombre del middleware y el segundo nombre al path.
- Añade como prefijo "/api/auth" a todas las rutas del archivo "./routes/auth"
- Al escribir "/api/auth", importará el archivo de la ruta en el segundo argumento
*/
app.use("/api/auth", require("./routes/auth"));

// Mapeo de cualquier petición GET que no esté mapeada previamente
app.get("*", (req, res) => {
  // sendFile() : De argumento construiremos el path donde tenemos nuestro "index.html"
  // __dirname : Constante propia de nodejs, que indica la ruta donde está desplegado nuestro servidor
  // De esta forma podemos navegar sin problemas en las rutas de la aplicación de Angular que está, en su "dist", dentro de la carpeta "public"
  res.sendFile(path.resolve(__dirname, "public/index.html"));
});

// levantamos la aplicaicón de express
// app.listen() : Con "app" utilizamos la aplicación y con "listen()" escucharemos cualquier información que venga hacia un puerto en específico
// El call back será la función que se ejecutará cuando se escuche exitosamente al puerto, es decir, cuando se levante exitosamente el serividor en el puerto indicado.
// Usualmente es un mensaje de confirmación
// process.env : Este objeto contiene las variables de entorno
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});
