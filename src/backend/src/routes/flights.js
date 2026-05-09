const express = require('express');
const prisma = require('../prismaClient');
const { verifyAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
    const { departureCity, arrivalCity, date } = req.query;
    let where = {};
    
    if (departureCity) {
        where.departureCity = { contains: departureCity, mode: 'insensitive' };
    }
    if (arrivalCity) {
        where.arrivalCity = { contains: arrivalCity, mode: 'insensitive' };
    }
    if (date) {
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);
        where.departureTime = {
            gte: startDate,
            lt: endDate
        };
    }

    try {
        const flights = await prisma.flight.findMany({ where });
        res.json(flights);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const flight = await prisma.flight.findUnique({
            where: { id: parseInt(req.params.id) }
        });
        if (!flight) return res.status(404).json({ message: "Flight not found" });
        res.json(flight);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', verifyAdmin, async (req, res) => {
    const { airlineName, departureCity, arrivalCity, departureTime, arrivalTime, price, durationMinutes, destination_id } = req.body;
    try {
        const newFlight = await prisma.flight.create({
            data: {
                airlineName,
                departureCity,
                arrivalCity,
                departureTime: new Date(departureTime),
                arrivalTime: new Date(arrivalTime),
                price: parseFloat(price),
                durationMinutes: durationMinutes ? parseInt(durationMinutes) : null,
                destinationId: parseInt(destination_id)
            }
        });
        res.status(201).json({ id: newFlight.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', verifyAdmin, async (req, res) => {
    const { airlineName, departureCity, arrivalCity, departureTime, arrivalTime, price, durationMinutes, destination_id } = req.body;
    try {
        const updatedFlight = await prisma.flight.update({
            where: { id: parseInt(req.params.id) },
            data: {
                ...(airlineName && { airlineName }),
                ...(departureCity && { departureCity }),
                ...(arrivalCity && { arrivalCity }),
                ...(departureTime && { departureTime: new Date(departureTime) }),
                ...(arrivalTime && { arrivalTime: new Date(arrivalTime) }),
                ...(price && { price: parseFloat(price) }),
                ...(durationMinutes && { durationMinutes: parseInt(durationMinutes) }),
                ...(destination_id && { destinationId: parseInt(destination_id) })
            }
        });
        res.json(updatedFlight);
    } catch (err) {
        if (err.code === 'P2025') return res.status(404).json({ message: "Flight not found" });
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', verifyAdmin, async (req, res) => {
    try {
        await prisma.flight.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.json({ message: "Flight deleted successfully" });
    } catch (err) {
        if (err.code === 'P2025') return res.status(404).json({ message: "Flight not found" });
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
