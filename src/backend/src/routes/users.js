const express = require('express');
const prisma = require('../prismaClient');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/', verifyAdmin, async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, firstName: true, lastName: true, email: true }
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', verifyToken, async (req, res) => {
    if (req.user.id !== parseInt(req.params.id) && req.user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
    }
    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(req.params.id) },
            select: { id: true, firstName: true, lastName: true, email: true }
        });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', verifyAdmin, async (req, res) => {
    try {
        await prisma.user.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        if (err.code === 'P2025') return res.status(404).json({ message: "User not found" });
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    if (req.user.id !== parseInt(req.params.id) && req.user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
    }
    const { firstName, lastName, email } = req.body;
    try {
        const updatedUser = await prisma.user.update({
            where: { id: parseInt(req.params.id) },
            data: {
                ...(firstName && { firstName }),
                ...(lastName && { lastName }),
                ...(email && { email })
            },
            select: { id: true, firstName: true, lastName: true, email: true }
        });
        res.json(updatedUser);
    } catch (err) {
        if (err.code === 'P2025') return res.status(404).json({ message: "User not found" });
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
