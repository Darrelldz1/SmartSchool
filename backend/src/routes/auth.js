// backend/src/routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
require('dotenv').config();

const router = express.Router();

// === Register ===
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // cek apakah user sudah ada
    const checkUser = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // simpan user
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, name, email, role`,
      [name, email, password_hash, role || 'user']
    );

    res.json({
      message: 'User registered successfully',
      user: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// === Login ===
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // buat JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successful',
      token,
      role: user.role,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// === Logout ===
router.post('/logout', async (req, res) => {
  try {
    const { token } = req.body; // token dikirim dari frontend (biasanya dari localStorage)
    if (!token) {
      return res.status(400).json({ error: 'Token is required for logout' });
    }

    // decode token tanpa verifikasi
    const decoded = jwt.decode(token);

    if (!decoded) {
      return res.status(400).json({ error: 'Invalid token' });
    }

    // simpan token ke blacklist
    await pool.query(
      `INSERT INTO token_blacklist (token, user_id, expired_at) 
       VALUES ($1, $2, to_timestamp($3))`,
      [token, decoded.id, decoded.exp] // decoded.exp dalam format UNIX epoch
    );

    res.json({ message: 'Logout successful, token blacklisted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
