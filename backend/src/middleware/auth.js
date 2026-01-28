const jwt = require('jsonwebtoken');
const pool = require('../db');
require('dotenv').config();

function authMiddleware(roles = []) {
  if (typeof roles === 'string') roles = [roles];

  return async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token missing" });
    }

    const token = authHeader.split(" ")[1];
    console.log("TOKEN DARI HEADER:", token);


    try {
      const check = await pool.query(
        'SELECT 1 FROM token_blacklist WHERE token=$1',
        [token]
      );

      if (check.rows.length > 0) {
        return res.status(401).json({ error: "Token revoked. Please login again." });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ error: "Forbidden" });
      }

      req.user = decoded;
      next();
    } catch (err) {
      console.error("JWT ERROR:", err.message);
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  };
}

module.exports = authMiddleware;
