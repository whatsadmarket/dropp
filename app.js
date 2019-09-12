var express = require('express');
var app = express();
var user = require('./controllers/user');
var api = require('./controllers/api');
var auth = require('./authentication/auth');
app.use('/user', user);
app.use('/auth', auth);
app.use('/api', api);
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 8080;

var server = app.listen(port, function() {
    console.log(`We\'re a go on ${port}`);
});