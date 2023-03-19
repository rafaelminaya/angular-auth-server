const jwt = require("jsonwebtoken");

const generarJWT = (uid, name) => {
  // Asignamos el payload con los datos necesarios
  const payload = { uid, name };

  // Retornamos un promesa, ya que el método "sign()" del móudlo "jsonwebtoken" solo devuelve un callback
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.SECRET_JWT_SEED,
      {
        // Asignamos vigencia  de 24 horas al token
        expiresIn: "24h",
      },
      // De esta forma obtenemos un error o el token generado
      (err, token) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(token);
        }
      }
    );
  });
};

// Exportamos la función
module.exports = {
  generarJWT,
};
