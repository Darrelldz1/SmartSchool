require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// === Middleware global ===
app.use(cors());
app.use(express.json()); // supaya bisa baca req.body JSON

// === Import routes ===
const authRoutes = require('./backend/src/routes/auth');
const profileRoutes = require('./backend/src/routes/profile');
const historyRoutes = require('./backend/src/routes/history');
const newsRoutes = require('./backend/src/routes/news');
const galleryRoutes = require('./backend/src/routes/gallery');
const passwordRoutes = require('./backend/src/routes/password');
const programRoutes = require('./backend/src/routes/program');
const teacherRoutes = require('./backend/src/routes/teacher');
const headmasterRoutes = require('./backend/src/routes/headmaster');
const siswaRoutes = require('./backend/src/routes/siswaRoutes');
const orangTuaRoutes = require('./backend/src/routes/orangTuaRoutes');
const prestasiRoutes = require('./backend/src/routes/prestasiRoutes');
const ptkRoutes = require('./backend/src/routes/ptkRoutes');
const ptkRiwayatSk = require('./backend/src/routes/ptkRIwayatSk');
const ptkPendidikanFormal = require('./backend/src/routes/ptkPendidikanFormal');
const ptkInpassing = require('./backend/src/routes/ptkInpassing');
const ptkPenghargaan = require('./backend/src/routes/ptkPenghargaan');
const ptkPelatihan = require('./backend/src/routes/ptkPelatihan');
const ptkAnak = require('./backend/src/routes/ptkAnak');
const ptkTestBahasa = require('./backend/src/routes/ptkTestBahasa');
const ptkMapel = require('./backend/src/routes/ptkMapel');
const ptkTugasTambahan = require('./backend/src/routes/ptkTugasTambahan');


// === Gunakan routes ===
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/program', programRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/headmaster', headmasterRoutes);
app.use('/api/siswaRoutes', siswaRoutes);
app.use('/api/orang-tua', orangTuaRoutes);
app.use('/api/prestasi', prestasiRoutes);
app.use('/api/ptk', ptkRoutes);
app.use('/api/ptk/sk', ptkRiwayatSk);
app.use('/api/ptk/pendidikan', ptkPendidikanFormal);
app.use('/api/ptk/inpassing', ptkInpassing);
app.use('/api/ptk/penghargaan', ptkPenghargaan);
app.use('/api/ptk/pelatihan', ptkPelatihan);
app.use('/api/ptk/anak', ptkAnak);
app.use('/api/ptk/test-bahasa', ptkTestBahasa);
app.use('/api/ptk/mapel', ptkMapel);
app.use('/api/ptk/tugas', ptkTugasTambahan);
app.use('/api/program', programRoutes);
app.use("/uploads", express.static("uploads"));



// === Root endpoint ===
app.get('/', (req, res) => {
  res.send('SmartSchool API running...');
});

// === Jalankan server ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
    