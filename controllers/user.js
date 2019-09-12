var db = require('./db');
const uuidv4 = require('uuid/v4');
var dropp = require('../controllers/helper');
var vfy = require('../authentication/verify');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var express = require('express');
var route = express();
var bod = require('body-parser');
route.use(bod.urlencoded({ extended: true }));
route.use(bod.json());

route.post('/upload/:id', dropp.upload.single('avi'), (req, res, next) => {
    db.execute("", []);
    res.send(req.file);
});

route.post('/createNew', (req, res) => {
    var que = `insert into userbase (id, fullName, email, mobileNumber, password, pinCode) values (?)`;
    var h_pass = bcrypt.hashSync(req.body.password, 10);
    var id_ = uuidv4();
    var rx = db.execute(que, [ id_, req.body['fullName'], req.body['email'], req.body['mobileNumber'], h_pass, req.body['pinCode'] ]);
    if (rx.success) {
        dropp.out(res, { message: 'User Saved' }, false);
    } else {
        dropp.out(res, { message : rx.message }, true);
    }
});

route.get('/all', vfy, function(req, res) {
    db.pool.getConnection(function(err, conn) {
        if (err) {
            console.error(err);
            conn.release();
        } else {
            conn.query("select * from userbase", function(error, rows) {
                conn.release();
                if (error) {
                    console.log("error in query");
                } else {
                    res.json(rows);
                }
            });
        }
    });
});

route.get('/:id', vfy, (req, res) => {
    db.getConnection((err, conn) => {
        if (!err) {
            let que = `select * from userbase where username = '${req.params.id}'`;
            db.pool.query(que, (err, result) => {
                // conn.release();
                if (err) {
                    console.log(err);
                    conn.release;
                }
                dropp.talk(res, 200, result, true);
            });
        } else {
            conn.release;
        }
    });
});

module.exports = route;