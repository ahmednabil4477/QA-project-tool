const express = require('express');
const prisma = require('../prismaClient');
const { verifyAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const destinations = await prisma.destination.findMany({
            orderBy: { country: 'asc' }
        });
        res.json(destinations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const destination = await prisma.destination.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { flights: true, topPlaces: true }
        });
        if (!destination) return res.status(404).json({ message: "Destination not found" });
        res.json(destination);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', verifyAdmin, async (req, res) => {
    const { name, country, description, images, rating, cost } = req.body;
    try {
        const newDest = await prisma.destination.create({
            data: { 
                name, 
                country, 
                description, 
                images: images ? String(images) : null,
                rating: rating ? parseFloat(rating) : null,
                cost: cost ? parseFloat(cost) : null
            }
        });
        res.status(201).json({ id: newDest.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', verifyAdmin, async (req, res) => {
    const { name, country, description, images, rating, cost } = req.body;
    try {
        const updatedDest = await prisma.destination.update({
            where: { id: parseInt(req.params.id) },
            data: {
                ...(name && { name }),
                ...(country && { country }),
                ...(description && { description }),
                ...(images && { images: String(images) }),
                ...(rating && { rating: parseFloat(rating) }),
                ...(cost && { cost: parseFloat(cost) })
            }
        });
        res.json(updatedDest);
    } catch (err) {
        if (err.code === 'P2025') return res.status(404).json({ message: "Destination not found" });
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', verifyAdmin, async (req, res) => {
    try {
        await prisma.destination.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.json({ message: "Destination deleted successfully" });
    } catch (err) {
        if (err.code === 'P2025') return res.status(404).json({ message: "Destination not found" });
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
