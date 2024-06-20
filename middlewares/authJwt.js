const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  let token = req.session ? req.session.token : null;

  if (!token) {
    return res.status(403).send('No se proporcionó ningún token');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send('Token inválido');
    }

    req.userId = decoded.id;
    next();
  });
};

module.exports = verifyToken;
