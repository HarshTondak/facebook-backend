const jwt = require("jsonwebtoken");

// Generate JWT tokens
exports.generateToken = (payload, expired) => {
  return jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: expired,
  });
};
