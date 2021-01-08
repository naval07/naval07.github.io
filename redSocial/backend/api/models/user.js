'use strict'

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = Schema({
    // El id lo crea moongose automaticamente
    name: String,
    email: String,
    username: String,
    password:String,
    birth_date: String,
    description: String,
    status: String,
    image: String // url
})

module.exports = mongoose.model("User", UserSchema) // (Nombre en la bd, esquema)