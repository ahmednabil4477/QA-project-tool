const express = require('express');
const prisma = require('../prismaClient');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const { parseId, handleError, requireRecord } = require('../utils/helpers');
const router = express.Router();

// GET /users — admin: list all users (safe fields only)
router.get('/', verifyAdmin, async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, firstName: true, lastName: true, email: true }
        });
        res.json(users);
    } catch (err) {
        handleError(res, err);
    }
});

// GET /users/:id — owner or admin
router.get('/:id', verifyToken, async (req, res) => {
    const id = parseId(req.params.id);
    if (req.user.id !== id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            select: { id: true, firstName: true, lastName: true, email: true }
        });
        if (!requireRecord(res, user, 'User')) return;
        res.json(user);
    } catch (err) {
        handleError(res, err);
    }
});

// DELETE /users/:id — admin only
router.delete('/:id', verifyAdmin, async (req, res) => {
    try {
        await prisma.user.delete({ where: { id: parseId(req.params.id) } });
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        if (err.code === 'P2025') return res.status(404).json({ message: 'User not found' });
        handleError(res, err);
    }
});


module.exports = router;
