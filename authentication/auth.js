var db = require('../controllers/db');
var drop = require('../controllers/helper');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var express = require('express');
var router = express();
var bod = require('body-parser');
router.use(bod.urlencoded({ extended: true }));
router.use(bod.json());

router.post('/signin', function(req, res) {
  db.pool.getConnection((err, conn) => {
    if (err) {
      console.error(err);
      conn.release;
    } else {
        let que_ = 'select id, password from userbase where mobileNumber = ?';
        conn.query(db.format(que_, [ req.body.mobileNumber ]), (err, rez) => {
          if (!err) {
            conn.release;
            let pass = rez[0].password;
            let user_id = rez[0].id;
            if (bcrypt.compareSync(req.body.password, pass)) {
              var token = jwt.sign({ id: user_id }, process.env.SECRET, {
                expiresIn: 86400 // expires in 24 hours
              });
              drop.talk(res, 200, { success: true, token: token, expires: 86400 }, true);
            } else {
              conn.release;
              drop.out(res, { message:"Invalid mobile number/password supplied" }, true);
            }
          }
        });
      }
  })
});

module.exports = router;