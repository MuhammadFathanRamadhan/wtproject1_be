const db = require('../config/database');

const User = {
    async findAll() {
        const [rows] = await db.query('SELECT id, name, email, role, photo, created_at, updated_at FROM users');
        return rows;
    },

    async findById(id) {
        const [rows] = await db.query('SELECT id, name, email, role, photo, created_at, updated_at FROM users WHERE id = ?', [id]);
        return rows[0];
    },

    async findByEmail(email) {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    },

    async create({ name, email, password, role = 'user' }) {
        const [result] = await db.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, password, role]
        );
        return result.insertId;
    },

    async update(id, { name, email, role }) {
        const fields = [];
        const values = [];
        if (name) { fields.push('name = ?'); values.push(name); }
        if (email) { fields.push('email = ?'); values.push(email); }
        if (role) { fields.push('role = ?'); values.push(role); }
        if (fields.length === 0) return false;
        values.push(id);
        await db.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
        return true;
    },

    async updatePhoto(id, photo) {
        await db.query('UPDATE users SET photo = ? WHERE id = ?', [photo, id]);
        return true;
    },

    async updatePassword(id, password) {
        await db.query('UPDATE users SET password = ? WHERE id = ?', [password, id]);
        return true;
    },

    async delete(id) {
        await db.query('DELETE FROM users WHERE id = ?', [id]);
        return true;
    }
};

module.exports = User;