const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    let decodedToken;

    decodedToken = jwt.verify(token, 'Thisisasecret-password-tercesasisihT');
    if (!decodedToken) {
      req.userId = "";
    }
    else {
      req.userId = decodedToken.userId;
    }
  }
  next();
};
