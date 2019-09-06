var jwt = require('jsonwebtoken');

function verify_token(req, res, next) {
  var token = req.headers['x-access-token'];
  if (!token) return res.status(403).send({ auth: false, message: 'No token provided.' });    
  jwt.verify(token, process.env.SECRET, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    console.log(req.body);
    req.userId = decoded.id;
    console.log(req.userId);
    next();
  });
}

module.exports = verify_token;