var express = require('express');
var app = express();
var bod = require('body-parser');
app.use(bod.urlencoded({ extended: true }));
app.use(bod.json());
var path = require('path');

app.get('/swg', (req, res) => {
    res.sendFile(path.join(__dirname + '/../api/swagger.json'));
});
app.get('/docs', (req, res) => {
    res.sendFile(path.join(__dirname + '/../api/docs.html'));
});

module.exports = app;