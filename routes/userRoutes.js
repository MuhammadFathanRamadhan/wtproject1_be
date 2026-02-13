const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');

// Profile sendiri (harus di atas /:id agar tidak tertangkap sebagai param)
router.get('/profile', auth, userController.getProfile);

// CRUD
router.get('/', auth, authorize('admin'), userController.getAll);
router.get('/:id', auth, userController.getById);
router.put('/:id', auth, userController.update);
router.delete('/:id', auth, authorize('admin'), userController.delete);

// Upload foto
router.put('/:id/photo', auth, userController.upload.single('photo'), userController.uploadPhoto);

module.exports = router;