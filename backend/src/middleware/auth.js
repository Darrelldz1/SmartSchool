const jwt = require('jsonwebtoken');
const pool = require('../db');
require('dotenv').config();

function authMiddleware(roles = []) {
  if (typeof roles === 'string') {
    roles = [roles]; // konversi string ke array
  }

  return async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) return res.status(401).json({ error: 'Token missing' });

    try {
      // cek blacklist
      const check = await pool.query('SELECT * FROM token_blacklist WHERE token=$1', [token]);
      if (check.rows.length > 0) {
        return res.status(401).json({ error: 'Token revoked. Please login again.' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // cek role
      if (roles.length > 0 && !roles.includes(decoded.role)) {
        return res.status(403).json({ error: 'Forbidden: insufficient privileges' });
      }

      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid or expired token' });
    }
  };
}

module.exports = authMiddleware;
