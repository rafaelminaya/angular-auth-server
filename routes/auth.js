const { Router } = require("express");
const { check } = require("express-validator");
const {
  crearUsuario,
  loginUsuario,
  revalidarToken,
} = require("../controllers/auth");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");

// Función Router() que configura la ruta, el cual nos permite usar a los métodos http.
const router = Router();

/*
-- CREAR NUEVO USUARIO -- 
post()
- Primer argumento representa el enpoint
- Segundo argumento es el call back que realiza la acción a la ruta. 
  El call back en este lugar es conocido conocido como el "controlador de esta ruta".
  Debe ser movido a otro archivo ya que suele crecer bastante.
- El tercer argumento es el "controlador de la ruta" solo si en el segundo argumento se le asigna un middleware
  Este middleware es usado generalmente para validaciones al endpoint antes de llegar al "controlador de esta ruta".
check()
 - El primer argumento será el campo a recibir del request y el segundo el mensaje de error para cualquier validación a este campo
 - Este método creará el objeto que contendrá los errores para ser manipulado por el callback.
 - "name" : Nombre del campo recibido por la petición
 - Al pasar por el middleware, en la request tenemos un nuevo objeto, manipulado en el controlador

 crearUsuario  
  - Es el método importado del archivo "../controllers/auth"
  - El método estará sin paréntesis, ya que no es ejecutado sino enviándolo como referencia
.not().isEmpty()
  - Validación para indicar que el campo es obligatorio.
  - Estos son métodos del "express-validator"
*/
router.post(
  "/new",
  [
    check("name")
      .not()
      .isEmpty()
      .withMessage("El nombre es obligatorio")
      .isLength({ min: 3 })
      .withMessage("El nombre debe contene al menos 3 caracteres"),
    check("email")
      .notEmpty()
      .withMessage("El email es obligatorio")
      .isEmail()
      .withMessage("El email ingresado no es valido"),
    check("password")
      .notEmpty()
      .withMessage("La contraseña es obligatoria")
      .isLength({ min: 6 })
      .withMessage("La contraseña es mínimo de 6 caracteres"),
    // middleware que controla las validaciones, ya que estos son funciones que vienen de arriba hacia abajo
    validarCampos,
  ],
  crearUsuario
); // localhost:4000/new

// -- LOGIN DE USUARIO --
/*
 - Segundo argumento representa el middleware hacia la ruta
 - Usaremos el middleware para validaciones
 - Para enviar varios middleware, indicarlos por medio de un arreglo

*/
router.post(
  "/",
  [
    check("email", "El email es obligatorio").isEmail(),
    check("password", "La contraseña es obligatorio").isLength({ min: 6 }),
    // middleware que controla las validaciones, ya que estos son funciones que vienen de arriba hacia abajo
    validarCampos,
  ],
  loginUsuario
); // localhost:4000/

// -- VALIDAR Y REVALIDAR TOKEN --
router.get("/renew", validarJWT, revalidarToken); // localhost:4000/renew

// exportamos la constante "router"
module.exports = router;
