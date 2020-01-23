'use strict'

var express = require('express')
var UserController = require('../controllers/userController')
var md_auth = require('../middlewares/authenticated')

//RUTAS

var api = express.Router()
api.post('/registrar', UserController.register);
api.post('/login', UserController.login);
api.get('/ejemplo', md_auth.ensureAuth ,UserController.ejemplo)
api.put('/editar-usuario/:idUsuario', md_auth.ensureAuth , UserController.editarUsuario)
api.get('/buscar-user', md_auth.ensureAuth, UserController.BuscarUser)

module.exports = api;

