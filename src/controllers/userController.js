'use strict'

var bcrypt = require('bcrypt-nodejs');
var user = require('../models/user')

function register(req, res){
    var user = new User();
    var params = req.body;

    if(params.name && params.usuario && params.password){
        user.name = params.name
        user.user = params.usuario
        user.email = params.email
        user.rol = 'ROLE_USUARIO'
        user.image = null;

        User.find({ $or: [
            { usuario:user.usuario },
            { email: user.email }
        ]}).exec((err,users)=>{
            if(err) return res.status(500).send({ message: 'Error en la peticion de usuarios' })

            if(usuarios && usuarios.length >= 1 ){
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

module.exports = {
    register
}