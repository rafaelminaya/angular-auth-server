// Alternativa para poder usar tipado en JS
// Importamos el objeto "response" de "express"
const { response } = require("express");
const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");

// Asignamos el "response" importado con el fin de que el IDE liste sus métodos.
// Es opcional ya que podemos escribir los métodos, pero a mano sin ayuda del IDE
// Añadimos necesariamente el "async" ya que dentro tendremos un "await"
const crearUsuario = async (req, resp = response) => {
  // Desestructuro las propiedades del body de la petición http
  const { email, name, password } = req.body;

  try {
    // 1) Verificación de email único
    // findOne() : Método de mongodb, obtenido por el uso moongose. Además es retornado como una promesa
    const usuario = await Usuario.findOne({ email: email });

    if (usuario) {
      return resp.status(400).json({
        ok: false,
        msg: "El usuario ya existe con ese email",
      });
    }
    // 2) Creamos el usuario con el modelo
    const dbUser = new Usuario(req.body);

    // 3) Hash de la contraseña
    // se conoce como un "salt" a una forma aleatoria para crear unos números que serán parte de al validación de la contraseña
    // genSaltSync() : Método que por medio de 10 vueltas genera el "salt"
    const salt = bcrypt.genSaltSync();

    // hashSync() : Encripta la contaseña con un hash, recibe el password a encriptar y el "salt"
    dbUser.password = bcrypt.hashSync(password, salt);

    // 4) Generar el JWT
    // Podemos usar "await" ya que devuelve una promesa, con el fin de que espere hasta tener toda la información
    // Si hay algún error, este se irá al "catch()"
    const token = await generarJWT(dbUser.id, dbUser.name);
    // 5) Crear usuario de DB
    // Al ser save() una función, usaremos await para que se espere hasta tener toda la información del nuevo usuario
    await dbUser.save();
    // 6) Generar respuesta exitosa
    return resp.status(201).json({
      ok: true,
      uid: dbUser.id,
      name: name,
      email: email,
      token: token,
    });
    // Respondemos a la petición
  } catch (error) {
    console.log(error);

    return resp.status(500).json({
      ok: true,
      msg: "Por favor hable con el administrador",
    });
  }
};

const loginUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    // Obtenemos el email del usuario en la DB
    const dbUser = await Usuario.findOne({ email: email });
    // Verificación de que el email exista en la DB
    if (!dbUser) {
      return res.status(400).json({
        ok: false,
        msg: "El correo no existe",
      });
    }
    // Comparamos password recibido en caso coincida con la DB
    // compareSync() : Compara si la contraseña recibida coincide con la DB
    const validPassword = bcrypt.compareSync(password, dbUser.password);

    // Verificación de que ambas contraseñas coincidan
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "El password no es válido",
      });
    }
    // Si llegamos hasta acá, todo funcionó bien y generamos el JWT
    const token = await generarJWT(dbUser.id, dbUser.name);
    // Respuesta a la petición
    return res.json({
      ok: true,
      uid: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "hable con el administador",
    });
  }
};

const revalidarToken = async (req, res = response) => {
  const { uid } = req;
  // Ler de la base de datos
  const dbuser = await Usuario.findById(uid);

  const token = await generarJWT(uid, dbuser.name);
  // Respondemos a la petición
  return res.json({
    ok: true,
    msg: "Renew",
    uid,
    name: dbuser.name,
    email: dbuser.email,
    token,
  });
};

// exporto las funciones
module.exports = { crearUsuario, loginUsuario, revalidarToken };
