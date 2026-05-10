const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../prismaClient');
const { SECRET_KEY } = require('../middleware/auth');
const router = express.Router();

router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ message: "Please provide all required fields." });
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ message: "Email already exists." });
        
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        
        const newUser = await prisma.user.create({
            data: { firstName, lastName, email, password: hash }
        });
        
        res.status(201).json({ message: "User registered successfully", id: newUser.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // First check if it's an Admin
        const admin = await prisma.admin.findUnique({ where: { email } });
        if (admin) {
            const isValid = bcrypt.compareSync(password, admin.password);
            if (!isValid) return res.status(401).json({ message: "Invalid password" });
            
            const token = jwt.sign({ id: admin.id, email: admin.email, role: 'admin' }, SECRET_KEY, { expiresIn: '24h' });
            return res.json({ message: "Login successful", token, user: { id: admin.id, firstName: "Admin", lastName: "", email: admin.email, role: 'admin' } });
        }

        // If not Admin, check User
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isValid = bcrypt.compareSync(password, user.password);
        if (!isValid) return res.status(401).json({ message: "Invalid password" });

        const token = jwt.sign({ id: user.id, email: user.email, role: 'user' }, SECRET_KEY, { expiresIn: '24h' });
        res.json({ message: "Login successful", token, user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: 'user' } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
