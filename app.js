var express = require('express');
var app = express();
var user = require('./controllers/user');
var auth = require('./authentication/auth');
app.use('/user', user);
app.use('/auth', auth);
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 8080;

var server = app.listen(port, function() {
    console.log(`We\'re a go on ${port}`);
});