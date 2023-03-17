const jwt = require('jsonwebtoken');

const generateToken = (data, cb) => {
  jwt.sign({
    data
  }, process.env.SECRET, { expiresIn: '1h' }, function (error, data) {
    cb(error, data)
  });
}

const verifyToken = (token, cb) => {
  jwt.verify(token, process.env.SECRET, {}, function (error, data) {
    if (!error) {
      cb(null, true)
    } else {
      cb(true)
    }
  })
}

const verifyTokenMiddleware = (req, res, next) => {
  const { access_token } = req.headers;
  verifyToken(access_token, function (error, data) {
    if (!error) {
      next();
    } else {
      return res.status(403).send({ message : 'Invalid Token'});
    }
  })
}

const decodeToken = (access_token) => {
  const decodedValue = jwt.decode(access_token, {complete: true});
  return decodedValue;
}

module.exports.generateToken = generateToken;
module.exports.verifyToken = verifyToken;
module.exports.verifyTokenMiddleware = verifyTokenMiddleware;
module.exports.decodeToken = decodeToken;