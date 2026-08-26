const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'smartcart_super_secret_jwt_key_2026_production_grade', {
    expiresIn: '30d',
  });
};

module.exports = generateToken;
