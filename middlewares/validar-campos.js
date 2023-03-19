const { response } = require("express");
const { validationResult } = require("express-validator");

// next : Es un parámetro que representa una función que debemos invocar cuando todo funciona correctamente
const validarCampos = (req, resp = response, next) => {
  // Obtenemos y almacenamos los errores obtenidos del request, debido a que usamos el middleware
  // validationResult() : Método propio de "express-validator" para obtener los errores
  const errors = validationResult(req);

  // Validación de que los campos no tengan errores
  if (!errors.isEmpty()) {
    return resp.status(400).json({
      ok: false,
      errors: errors.mapped(),
    });
  }
  next();
};

module.exports = {
  validarCampos,
};
