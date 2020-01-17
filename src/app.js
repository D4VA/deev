'use strict'

//VARIABLES

const express = require('express')
const app = express()
const bodyParse = require('body-parser')

//EXPORTAR
module.exports = app;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/PRUEBA118',{ useNewUrlParser: true })
.then(() => {
    console.log('Conectado a MongoDB')    
})
