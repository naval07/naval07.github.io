// Definicion de las rutas
'use strict'

// Modulo que instalamos para encriptar
let bcrypt = require('bcrypt-node');

const {param} = require('../app');
let User = require('../models/user')
let jwt = require('../services/jwt')
let mongoosePagination= require("mongoose-pagination");
let path = require('path');
let fs = require('fs');
const { restart } = require('nodemon');

function home(req, res){
    res.status(200).send(
        {saludo: "Hola a todos los desarrolladores."}
    )
}

function pruebas(req,res){
    res.status(200).send(
        {saludo: "Saludo a los desarrolladores desde pruebas"}
    )
}

function saveUser(req,res){
    let params = req.body;
    let user = new User();

    // Los campos importantes
    if (params.name && params.email && params.username && params.password){
        user.name = params.name;
        user.email = params.email;
        user.username = params.username;
        user.image = null;
        user.description = null;

        // Aseguramos que dos usuarios no se creen con el mismo username
        // User.find({email: user.email.toLowerCase(), username: user.username.toLowerCase()}) // Separamos con , cuando la busqueda es &

        User.find({
            $or:[{email: user.email.toLowerCase()}, {username: user.username.toLowerCase()}] // Creamos una lista con los objetos cuando la busqueda es ó
        }).exec((err, users) => {
            // En caso de que haya un error enviamos un mensaje al usuario y un código 500
            if (err){
                return res.status(500).send({
                    message:"Hubo un error en la peticion"
                })
            }
            // En caso de que tengamos un duplicado
            if(users && users.length >= 1){
                return res.status(200).send({
                    message: "El usuario ya está registrado con ese correo electrónico o ese usuario"
                })
            // Si no tenemos duplicados, agregamos los datos
            }else{
                // Encriptamos la contraseña
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    if (err){
                        console.log("Error haciendo la encriptacion del password");
                    }else{
                        user.password = hash;
                    }
                    user.save((err, userStored) => {
                        if (err) {
                            return res.status(500).send({
                                message: 'Error al guardar el usuario'
                            })
                        }
                        if (userStored){
                            res.status(200).send({
                                message: 'El usuario fue almacenado exitosamente.',
                                user: userStored
                            })
                        }else{
                            res.satus(404).send({
                                message: 'El usuario no pudo ser almacenado correctamente.'
                            })
                        }
                    })
                })
            }
        })
    }else{
        res.status(200).send({
            message: "¡Enviar todos los campos!"
        })
    }
}


function loginUser(req, res){
    let params = req.body;
    
    if(params.email && params.password){
        let email = params.email;
        let password = params.password;
        User.findOne({email: email}, (err, userFound) =>{
            if (err){
                return res.status(500).send({
                    message: "Hubo un error en la peticion del usuario"
                })
            }
            if (userFound){
                // Compara la contraseña ingresada con la contraseña en la base de datos + la funcion a ejecutar si las contraseñas coinciden
                bcrypt.compare(password, userFound.password, (err, check) => {
                    if (err){
                        return res.status(500).send({message: "No se completó la solicitud, error"})
                    }
                    if (check){
                        if (params.gettoken){
                            // Token
                            return res.status(200).send({
                                token: jwt.createToken(userFound)
                            })
                            // return res.status(200).send({userFound}) // Status satisfacible y retornamos el usuario
                        }else{
                            userFound.password = undefined;
                            return res.status(200).send({userFound})
                        }
                    }else{
                        return res.status(200).send({message: "El usuario no está registrado, verificar o registrarse"})
                    }
                }) 
            }else{
                return res.status(500).send({message: "No se encontró el usuario"})
            }
        })
    }else{
        return res.status(200).send({
            message: "No se encontró el e-mail del usuario o la contraseña"
        })
    }
}

// Funcion para traer la informacion del usuario
function getUser(req, res){
    let userId = req.params.id;
    // Necesitamos, callback que le diga que hacer cuando lo encuentre
    User.findById(userId, (err, userFound)=>{
        if (err){
            return res.status(500).send({message: "Hubo un error en la petición"})
        }
        // Si no encuentra el usuario
        if (!userFound){
            return res.status(200).send({message: 'Usuario no encontrado.'})
        }
        return res.status(200).send({userFound})
    });
}

function getUsers(req,res){
    let page = 1; // Página que quiero que traiga por default
    // Si el usuario trae una página especifica
    if (req.params.page){
        page = req.params.page;
    }

    let docsPerPage = 5;

    User.find().sort('_id').paginate(page, docsPerPage, (err, users, total) => {
        // Si hay error
        if (err){
            return res.status(500).send({
                message: "Hubo un error consultando los usuarios"
            })
        }
        // Si no encuentra usuarios
        if (!users) return res.status(200).send({ message: "No hay usuarios para mostrar"})
        // Si todo funciono bien
        return res.status(200).send({
            users,
            total,
            pages: Math.ceil(total/docsPerPage)
        })
    })
}

// Modificacion de los datos de usuario
function updateUser(req, res){
    let userId = req.params.id;
    let userUpdate = req.body;

    delete userUpdate.password; // Para no cambiar la contraseña

    if (userId != req.user.sub){ // sub = id
        return res.status(500).send({message: "El usuario no tiene permisos para modificar este usuario"})
    }

    User.findByIdAndUpdate(userId, userUpdate, {new:true}, (err, userUpdate) => {
        if (err){
            return res.status(500).send({
                message: 'Error en la actualización'
            })
        }

        if (!userUpdate){
            return res.status(500).send({message: "No fueron enviados datos para acctualizar"})
        }

        return res.status(200).send({
            userUpdate
        })
    })
}

// Para cargar la foto del usuario

function updateImage(req, res){
    let userId = req.params.id;
    
    if (userId != req.user.sub){ // sub = id
        return res.status(500).send({message: "El usuario no tiene permisos para modificar este usuario"})
    }
    // Comprobamos que se envie un archivo
    if (req.files){
        console.log("Hasta aquí va la solicitud")
        let file_path = req.files.image.path;
        console.log(req.files);
        let file_split = file_path.split('/');
        console.log(file_split);

        let file_name = file_split[2];
        let ext_file = file_name.split('\.')[1];
        console.log(ext_file);

        if(["png", "jpg", "gif", "svg", "jpeg"].includes(ext_file)){
            User.findOneAndUpdate(userId, {image: file_name}, {new:true}, (err, userUpdated) => {
                if (err){
                    return res.status(500).send({message: "Hubo un error al actualizar la imagen"})
                }

                if (!userUpdated){
                    return res.satus(200).send({
                        message: "No se encontró el usuario para actualizar"
                    })
                }

                return res.status(200).send({
                    message: "La imagen se atualizó correctamente",
                    userUpdated
                })
            })
        }else{
            fs.unlink(file_path,() => {  // File system
                return res.status(200).send({
                    message:"La extendión del archivo no es correcta"
                })
            })
        }
    }else{
        return res.status(200).send({message: "No se ha cargado ningun archivo"})
    }
}

module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    updateUser,
    updateImage
}