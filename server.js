process.env.NODE_ENV = process.env.NODE_ENV || 'development';

//var mongoose = require('./config/mongoose');
var express = require('./config/express');

var db = require('./config/sequelize');
var passport = require('./config/passport');

//var db = mongoose();
var app = express();
var passport = passport();
var port = Number(process.env.PORT) || 3000;

app.listen(port);

module.exports = app;

//console.log('Server running at http://localhost:' + port +'/');