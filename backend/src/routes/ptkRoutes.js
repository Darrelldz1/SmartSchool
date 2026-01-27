const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/auth");

// ✅ CREATE PTK (Dynamic insert)
router.post("/", auth(["admin"]), async (req, res) => {
  try {
    const data = req.body;

    // Ambil nama kolom & nilai secara otomatis
    const columns = Object.keys(data);
    const values = Object.values(data);

    if (columns.length === 0) {
      return res.status(400).json({ error: "No data provided" });
    }

    // Buat placeholder: $1, $2, $3 ...
    const placeholders = columns.map((_, idx) => `$${idx + 1}`);

    const query = `
      INSERT INTO ptk (${columns.join(", ")})
      VALUES (${placeholders.join(", ")})
      RETURNING *;
    `;

    const result = await pool.query(query, values);

    res.status(201).json({
      message: "PTK created successfully",
      ptk: result.rows[0],
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET ALL PTK
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM ptk ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET 1 PTK
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM ptk WHERE id=$1", [
      req.params.id,
    ]);
    if (!result.rows.length)
      return res.status(404).json({ error: "PTK not found" });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ UPDATE PTK (Dynamic)
router.put("/:id", auth(["admin"]), async (req, res) => {
  try {
    const data = req.body;

    const columns = Object.keys(data);
    const values = Object.values(data);

    const setExpressions = columns.map(
      (col, idx) => `${col} = $${idx + 1}`
    );

    const query = `
      UPDATE ptk 
      SET ${setExpressions.join(", ")}
      WHERE id = $${columns.length + 1}
      RETURNING *;
    `;

    const result = await pool.query(query, [...values, req.params.id]);

    res.json({
      message: "PTK updated successfully",
      ptk: result.rows[0],
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE
router.delete("/:id", auth(["admin"]), async (req, res) => {
  try {
    await pool.query("DELETE FROM ptk WHERE id=$1", [req.params.id]);
    res.json({ message: "PTK deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
