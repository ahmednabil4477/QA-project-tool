const express = require('express');
const prisma = require('../prismaClient');
const { verifyAdmin } = require('../middleware/auth');
const { parseId, handleError, requireRecord } = require('../utils/helpers');
const router = express.Router();

// GET /destinations — public
router.get('/', async (req, res) => {
    try {
        const destinations = await prisma.destination.findMany({ orderBy: { country: 'asc' } });
        res.json(destinations);
    } catch (err) {
        handleError(res, err);
    }
});

// GET /destinations/:id — public, includes flights + topPlaces
router.get('/:id', async (req, res) => {
    try {
        const destination = await prisma.destination.findUnique({
            where: { id: parseId(req.params.id) },
            include: { flights: true, topPlaces: true }
        });
        if (!requireRecord(res, destination, 'Destination')) return;
        res.json(destination);
    } catch (err) {
        handleError(res, err);
    }
});

// POST /destinations — admin only
router.post('/', verifyAdmin, async (req, res) => {
    const { name, country, description, images, rating, cost } = req.body;
    try {
        const newDest = await prisma.destination.create({
            data: {
                name, country, description,
                images: images ? String(images) : null,
                rating: rating ? parseFloat(rating) : null,
                cost: cost ? parseFloat(cost) : null,
            }
        });
        res.status(201).json({ id: newDest.id });
    } catch (err) {
        handleError(res, err);
    }
});


module.exports = router;
