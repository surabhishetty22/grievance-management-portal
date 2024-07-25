const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) return res.status(401).send('Access Denied');

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;

    if (req.user.role !== 'user') {
      return res.status(403).send('Access Denied');
    }

    next();
  } catch (error) {
    res.status(400).send('Invalid Token');
  }
};

module.exports = authenticate;
