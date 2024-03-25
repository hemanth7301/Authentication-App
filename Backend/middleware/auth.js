const jwt = require("jsonwebtoken");
require("dotenv").config();

async function auth(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).send({ error: "Authentication Failed!!!" });
  }
}

function localVariables(req, res, next) {
  req.app.locals = {
    OTP: null,
    resetSession: false,
  };
  next();
}

module.exports = { auth, localVariables };
