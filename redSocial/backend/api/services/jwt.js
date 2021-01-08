'use strict'

let jwt = require('jwt-simple');
let moment = require('moment');
let secret_key = "NorbertoEsElGatoMasLindoDelBackend"

function createToken(userFound){
    var payload = {
        sub: userFound._id,
        name: userFound.name,
        username: userFound.username,
        email: userFound.email,
        image: userFound.image,
        lat: moment().unix(), // Fecha actual con la codificacion de unix
        exp: moment().add(30, 'days') // Duracion del token y sus unidades
    }

    return jwt.encode(payload, secret_key)
}

module.exports = {createToken}