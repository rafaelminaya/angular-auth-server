const { response } = require("express");
const jwt = require("jsonwebtoken");

const validarJWT = (req, res = response, next) => {
  // obtenemos el key "x-token" de la cabecara/header de la petición
  const token = req.header("x-token");

  // validamos en caso no exista el token en la cabecera de la petición
  if (!token) {
    // Devuelvo 401 - Unauthorized
    return res.status(401).json({
      ok: false,
      msg: "error en el token",
    });
  }

  // Validación del token y la firma con el "secret key"
  try {
    const { uid, name } = jwt.verify(token, process.env.SECRET_JWT_SEED);
    console.log(uid, name);
    // Añadimos las propiedades "uid" y "name" al request.
    // Este argumento "req" es el mismo argumento que recibirá  la función "revalidarToken" (del controlador "auth.js" )
    // Puesto que la petición pasará primero por este Middleware y acá se le añadirán estas propiedades más a la petición/request
    req.uid = uid;
    req.name = name;
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "token no válido",
    });
  }
  // Si todo sale bien
  next();
};

module.exports = {
  validarJWT,
};
