'use strict' // Utilizar todas las funcionalidades ECMASCRIPT 6 >

let mongoose = require('mongoose');
let app = require('../api/app');
let port = 3800;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/RedSocial', // Esta es la ruta de la conexión de la base de datos
    {useMongoClient : true}) // Usar el cliente de mongo
    .then(() => {
        console.log(" ->  La conexión se realizó correctamene")
        // Crear nuestro servidor
        app.listen(port, () => {
            console.log("El servidor fue creado correctaamente y está corriendo en http://localhost:3800")
        })
    })
    .catch(err => console.log(err))