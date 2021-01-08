'use strict'

let express = require('express');
let bodyParser = require('body-parser'); // JSONificar
let app = express(); // Cargar el framework de express para hacer las conexiones que necesitemos y montar el servidor

/// Cargar rutas
let user_routes = require('../api/routes/user');


/// Middlewares
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());

/// Cors

/// Rutas

app.use('/api', user_routes);
// app.get('/', (req, res) => {
//     res.status(200).send( // Estatus 200's es que hubo contacto con el servidor
//         {saludo: "Hola a todos los users."}
//     ) 
// })

// app.post('/pruebas', (req, res) => {
//     console.log(req.body); // req es la var. donde se guarda la respuesta del servidor
//     res.status(200).send( // Estatus 200's es que hubo contacto con el servidor
//         {saludo: "Hola a todos los users. Estamos desde pruebas"}
//     ) 
// })

// Conectamos los archivos app.js e index.js
module.exports = app;

