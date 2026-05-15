const express = require('express');
const prisma = require('../prismaClient');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const reviews = await prisma.review.findMany({
            include: { user: { select: { firstName: true, lastName: true } } },
            orderBy: { createdAt: 'desc' },
            take: 10
        });

        const formatted = reviews.map(r => ({
            ...r,
            firstName: r.user.firstName,
            lastName: r.user.lastName
        }));

        res.json(formatted);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/destination/:destination_id', async (req, res) => {
    try {
        const reviews = await prisma.review.findMany({
            where: { destinationId: parseInt(req.params.destination_id) },
            include: { user: { select: { firstName: true, lastName: true } } }
        });

        const formatted = reviews.map(r => ({
            ...r,
            firstName: r.user.firstName,
            lastName: r.user.lastName
        }));

        res.json(formatted);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', verifyToken, async (req, res) => {
    const { comment, rating, destination_id } = req.body;
    try {
        const newReview = await prisma.review.create({
            data: {
                comment,
                rating: parseFloat(rating),
                userId: req.user.id,
                destinationId: parseInt(destination_id)
            }
        });
        res.status(201).json({ id: newReview.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
