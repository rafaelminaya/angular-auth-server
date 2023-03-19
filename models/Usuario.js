const { Schema, model } = require("mongoose");

/*
 - Creamos un modelo de moongose, en el cual le indica a MongoDB cómo queremos que luzcan las colecciones de datos
 - También podemos añadir validaciones a las colecciones
 - El archivo será "Usuario.js" ya que representará una instancia para enviar información a la DB

 Schema()
 - Funcion que se ejecuta con ciertos argumentos, los cuales representan las validaciones
*/
const UsuarioSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

/*
model('Usuario') : 
 - Forma de exsportar un Schema
 - Primer argumento el nombre de la colección y segundo argumento el Schema
 - moongose lo hará plural, es decir, "Usuarios" como nombre de colección
*/
module.exports = model("Usuario", UsuarioSchema);
