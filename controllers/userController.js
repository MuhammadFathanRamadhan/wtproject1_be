const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const multer = require('multer');
const path = require('path');

// Multer config untuk upload foto
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `user_${req.params.id}_${Date.now()}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.gif'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Hanya file gambar yang diperbolehkan'), false);
    }
};

exports.upload = multer({ storage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 } });

// GET /api/users — Admin only
exports.getAll = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json({ message: 'Berhasil', data: users });
    } catch (err) {
        res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message });
    }
};

// GET /api/users/profile — User sendiri
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });
        res.json({ message: 'Berhasil', data: user });
    } catch (err) {
        res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message });
    }
};

// GET /api/users/:id
exports.getById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });
        res.json({ message: 'Berhasil', data: user });
    } catch (err) {
        res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message });
    }
};

// PUT /api/users/:id
exports.update = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
            return res.status(403).json({ message: 'Akses ditolak' });
        }

        const { name, email, password, role } = req.body;

        const updateData = { name, email };
        if (req.user.role === 'admin' && role) {
            updateData.role = role;
        }

        await User.update(id, updateData);

        if (password) {
            const hashed = await bcrypt.hash(password, 10);
            await User.updatePassword(id, hashed);
        }

        const updated = await User.findById(id);
        res.json({ message: 'User berhasil diupdate', data: updated });
    } catch (err) {
        res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message });
    }
};

// DELETE /api/users/:id — Admin only
exports.delete = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

        await User.delete(req.params.id);
        res.json({ message: 'User berhasil dihapus' });
    } catch (err) {
        res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message });
    }
};

// PUT /api/users/:id/photo
exports.uploadPhoto = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
            return res.status(403).json({ message: 'Akses ditolak' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'File foto wajib diupload' });
        }

        const photoPath = req.file.filename;
        await User.updatePhoto(id, photoPath);

        res.json({ message: 'Foto berhasil diupload', data: { photo: photoPath } });
    } catch (err) {
        res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message });
    }
};