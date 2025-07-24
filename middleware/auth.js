require('dotenv').config()
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer"))
      return res.status(401).json({ Message: "No token,access denied" });
   
    const token = authHeader.split(" ")[1];

    const decode = jwt.verify(token, JWT_SECRET);
    if (!decode || !decode.id) {
      return res.status(401).json({ Message: "Invalid token payload" });
    }
    req.header = decode;
    next();
  } catch (error) {
    res.status(401).json({ Message: "Invalid token" });
  }
};
