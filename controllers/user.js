var db = require('./db');
const uuidv4 = require('uuid/v4');
var drop = require('../controllers/helper');
var vfy = require('../authentication/verify');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var express = require('express');
var multer = require('multer');
var route = express();
var bod = require('body-parser');
route.use(bod.urlencoded({ extended: true }));
route.use(bod.json());

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now());
    }
});

var upload = multer({ storage : storage}).single('userPhoto');

route.post('/create', (req, res) => {
    db.pool.getConnection((err, conn) => {
        if (err) {
            console.error(err);
            conn.release;
        } else {
            var h_pass = bcrypt.hashSync(req.body.password, 10);
            var id_ = uuidv4();
            var que = `insert into userbase (id, fullName, email, mobileNumber, password, pinCode) values (?)`;
            conn.query(db.format(que, [ id_, req.body['fullName'], req.body['email'], req.body['mobileNumber'], h_pass, req.body['pinCode'] ]), (err) => {
                conn.release;
                if (!err) {
                    drop.out(res, { message: 'User Saved' }, false);
                } else {
                    drop.out(res, { message : err.message }, true);
                    console.error(err.code);
                }
            });
        }
    });
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
    // db.getConnection((err, conn) => {
    //     if (!err) {
            let que = `select * from userbase where username = '${req.params.id}'`;
            db.pool.query(que, (err, result) => {
                // conn.release();
                if (err) {
                    console.log(err);
                    return;
                }
                helper.talk(res, 200, result, true);
            });
    //     }
    // });
});

module.exports = route;