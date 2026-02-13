const express = require('express');
const app = express();
const PORT = 3000;

// Middleware agar server bisa membaca JSON (penting untuk kirim data dari Flutter)
app.use(express.json());

// Endpoint percobaan (Bisa diakses dari browser atau Flutter)
app.get('/', (req, res) => {
    res.send({
        message: "Server Node.js sudah berjalan!",
        status: "sukses"
    });
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server aktif di http://localhost:${PORT}`);
});
