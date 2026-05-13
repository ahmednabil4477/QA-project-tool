const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const prisma  = require('../prismaClient');
const { SECRET_KEY }  = require('../middleware/auth');
const { handleError } = require('../utils/helpers');
const router  = express.Router();

router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    try {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return res.status(400).json({ message: 'Email already exists.' });

        const hash    = bcrypt.hashSync(password, 10);
        const newUser = await prisma.user.create({
            data: { firstName, lastName, email, password: hash }
        });

        res.status(201).json({ message: 'User registered successfully', id: newUser.id });
    } catch (err) {
        handleError(res, err);
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check admin first
        const admin = await prisma.admin.findUnique({ where: { email } });
        if (admin) {
            if (!bcrypt.compareSync(password, admin.password)) {
                return res.status(401).json({ message: 'Invalid password' });
            }
            const token = jwt.sign(
                { id: admin.id, email: admin.email, role: 'admin' },
                SECRET_KEY,
                { expiresIn: '24h' }
            );
            return res.json({
                message: 'Login successful',
                token,
                user: { id: admin.id, firstName: 'Admin', lastName: '', email: admin.email, role: 'admin' }
            });
        }

        // Check regular user
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: 'user' },
            SECRET_KEY,
            { expiresIn: '24h' }
        );
        res.json({
            message: 'Login successful',
            token,
            user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: 'user' }
        });
    } catch (err) {
        handleError(res, err);
    }
});

module.exports = router;
