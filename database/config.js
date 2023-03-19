const mongoose = require("mongoose");

// Usamos async-await ya que no queremos que la aplicación continúe hasta no se haya conectado a la DB
const dbConnection = async () => {
  // el try/catch por si hay un error de conexion
  try {
    /* conexión a MongoDB
    mongoose : 
     -Es un gestor que ayuda a interactuar con MongoDB fácilmente.    
    connect()
     - Retorna una promesa. De esta forma añadimos el "await" con el fin de esperar y no ejecute nada más hasta que se resuelva dicha promesa.
     - Eñ argumento es la cadena de conexión a la DB
    */
    await mongoose.connect(process.env.DB_CNN);

    console.log("DB Online");
  } catch (error) {
    // Mensaje solo visto por el administrador
    console.log(error);
    // Detenemos la aplicación y enviamos un mensaje para los usuarios normales
    throw new Error("Error a la hora de inicializar la DB");
  }
};

module.exports = {
  dbConnection,
};
