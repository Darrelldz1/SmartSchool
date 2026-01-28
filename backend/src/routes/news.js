const express = require("express");
const pool = require("../db");
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

const router = express.Router();

/* ================== MULTER (HANYA SEKALI) ================== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/news");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* ================== ROUTES ================== */

// GET all news
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM news ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET news by id
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM news WHERE id = $1",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "News not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE news
router.post("/", auth(["admin", "guru"]), async (req, res) => {
  const { title, content } = req.body;
  upload.single('image')

  try {
    const result = await pool.query(
      "INSERT INTO news (title, content) VALUES ($1, $2) RETURNING *",
      [title, content]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE news
router.put(
  "/:id",
  auth(["admin", "guru"]),
  upload.single("image"),
  async (req, res) => {
    const { title, content } = req.body;
    const { id } = req.params;

    let query;
    let values;

    if (req.file) {
      const imageUrl = `/uploads/news/${req.file.filename}`;
      query = `
        UPDATE news
        SET title=$1, content=$2, image_url=$3
        WHERE id=$4
        RETURNING *
      `;
      values = [title, content, imageUrl, id];
    } else {
      query = `
        UPDATE news
        SET title=$1, content=$2
        WHERE id=$3
        RETURNING *
      `;
      values = [title, content, id];
    }

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "News not found" });
    }

    res.json(result.rows[0]);
  }
);

// DELETE news
router.delete("/:id", auth("admin"), async (req, res) => {
  const result = await pool.query(
    "DELETE FROM news WHERE id=$1 RETURNING *",
    [req.params.id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "News not found" });
  }

  res.json({ message: "Deleted", data: result.rows[0] });
});

module.exports = router;
