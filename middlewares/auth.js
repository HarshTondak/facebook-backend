const jwt = require("jsonwebtoken");

// User Authentication
exports.authUser = async (req, res, next) => {
  try {
    // We are sending the token from the header through the "Authorization" property
    let tmp = req.header("Authorization");

    // Removing the 1st 7 chars from the token (Bearer <token>)
    const token = tmp ? tmp.slice(7, tmp.length) : "";

    // If token have a falsy value
    if (!token) {
      return res.status(400).json({ message: "Invalid Authentification" });
    }

    // If token exists, then verify it
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(400).json({ message: "Invalid Authentification" });
      }
      // If token verified correctly...
      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
