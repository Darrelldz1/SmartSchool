const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db');

const router = express.Router();

// Simpan OTP di memory sementara
let otps = {};

// === Forgot Password (generate OTP) ===
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Email not found' });
    }

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otps[email] = { otp, expires: Date.now() + 5 * 60 * 1000 }; // berlaku 5 menit

    console.log(`🔑 OTP untuk ${email}: ${otp}`); // tampil di console
    res.json({ message: 'OTP generated. Check server console.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// === Reset Password ===
router.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    // validasi OTP
    if (!otps[email] || otps[email].otp !== otp || Date.now() > otps[email].expires) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // update password
    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password_hash=$1 WHERE email=$2', [hashed, email]);

    delete otps[email];
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
