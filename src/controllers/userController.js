'use strict'
//IMPORTS
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user')
var jwt = require('../services/jwt')//Token

function ejemplo(req, res){
    res.status(200).send({ message: 'hola' })
}


function register(req, res){
    var user = new User();
    var params = req.body;

    if(params.nombre && params.usuario && params.password){
        user.nombre = params.nombre
        user.usuario = params.usuario
        user.email = params.email
        user.rol = 'ROLE_USUARIO'
        user.image = null;

        User.find({ $or: [
            { usuario:user.usuario },
            { email: user.email }
        ]}).exec((err,users)=>{
            if(err) return res.status(500).send({ message: 'Error en la peticion de usuarios' })

            if(users && users.length >= 1 ){
                return res.status(500).send({ message: 'El usuario ya existe' })
            }else{
                bcrypt.hash(params.password, null, null, (err, hash)=>{
                    user.password = hash;

                    user.save((err, usuarioGuardado)=>{
                        if(err) return res.status(500).send({message: 'Error al guardar usuario'})

                        if(usuarioGuardado){
                            res.status(200).send({ user: usuarioGuardado })
                        }else{
                            res.status(404).send({ message: 'no se ha podido registrar el usuario' })
                        }
                    })
                })
            }
        })
    }else{
        res.status(200).send({
            message: 'Rellene todos los datos necesarios'
        })
    }
}

function login(req, res){
    var params = req.body;

    User.findOne({email: params.email},(err,user)=>{
        if(err) return res.status(500).send({message: 'Error'})
        
        if(user){
            bcrypt.compare(params.password, user.password, (err,check)=>{
                if(check){
                    if(params.gettoken){
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        })
                    }else{
                        user.password = undefined;
                        return res.status(200).send({ user })
                    }
                }else{
                    return res.status(404).send({message: 'el usuario no se ha podido registrar'})
                }
            })
        }else{
            return res.status(404).send({message: 'El usuario no se ha podido loguear'})
        }
    })
}
function editarUsuario(req, res){
    var userId = req.params.idUsuario
    var params = req.body
    
    //BORRAR LA PROPIEDAD DE PASSWORD PARA NO SER EDITADA
    delete params.password
    if(userId != req.user.sub){
        return res.status(500).send({ message: 'No tiene los permisos para actualizar este usuario' })
    }
    User.findByIdAndUpdate(userId, params, { new: true }, (err, usuarioActualizado) =>{
        if(err) return res.status(500).send({ message: 'Error en la petición' })
        if(!usuarioActualizado) return res.status(404).send({ message: 'Error no se ha podido actualizar los datos del usuario' })

        return res.status(200).send({ usuario: usuarioActualizado })
    })
}
function BuscarUser(req, res){
    var userId = req.params.sub

    if(userId != req.params.sub){
        return res.status(500).send({ message: 'No tiene los permisos para actualizar este usuarioo' })
    }
    User.findById( userId ,(err, obtainerUser)=>{
        if(err){ return res.status(500).send({ message: 'No tiene los permisos para actualizar este usuario' })
        }
        if(!obtainerUser) return res.status(404).send({ message: 'Error no se encontro el usuario' })

        return res.status(200).send({ usuario: obtainerUser})
    })
    
}

module.exports = {
    register,
    login,
    ejemplo,
    editarUsuario,
    BuscarUser
}