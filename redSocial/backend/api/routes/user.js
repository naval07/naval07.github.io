'use strict'

let express = require('express'); // Express permite hacer las peticiones http
let multipart = require('connect-multiparty');
let UserController = require('../controllers/user');
let mid_auth = require('../middlewares/auth');

let md_upload = multipart({ // Middleware
    uploadDir: './uploads/users'
})

let api = express.Router() // Aquí están todos los métodos con los que nosotros podemos hacer cualquier tipo de peticiones get/post/patch...

// Creamos el método get
// Parámetros: (Nombre de la ruta, middlewares, controlador) // Middlewares por defecto es vacío
api.get('/home', UserController.home);
api.get('/pruebas', mid_auth.validateAuth, UserController.pruebas);
// Método post para la hora de ingresar un nuevo usuario
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
// Traer informacion de los usuarios
api.get('/user/:id', mid_auth.validateAuth, UserController.getUser)
api.get('/users/:page?', mid_auth.validateAuth, UserController.getUsers) // Cuando el param es opcional, le pongo ?
// M;odificación de los datos de usuario
api.put('/update-user/:id', mid_auth.validateAuth, UserController.updateUser)
api.post('/upload-image/:id', [mid_auth.validateAuth, md_upload], UserController.updateImage)

module.exports = api;