const express = require('express');
const prisma   = require('../prismaClient');
const { verifyAdmin } = require('../middleware/auth');
const { parseId, handleError, requireRecord } = require('../utils/helpers');
const router   = express.Router();

// GET /flights — public, optional filters: departureCity, arrivalCity, date
router.get('/', async (req, res) => {
    const { departureCity, arrivalCity, date } = req.query;
    const where = {};

    if (departureCity) where.departureCity = { contains: departureCity, mode: 'insensitive' };
    if (arrivalCity)   where.arrivalCity   = { contains: arrivalCity,   mode: 'insensitive' };
    if (date) {
        const startDate = new Date(date);
        const endDate   = new Date(date);
        endDate.setDate(endDate.getDate() + 1);
        where.departureTime = { gte: startDate, lt: endDate };
    }

    try {
        const flights = await prisma.flight.findMany({ where });
        res.json(flights);
    } catch (err) {
        handleError(res, err);
    }
});

// GET /flights/:id — public
router.get('/:id', async (req, res) => {
    try {
        const flight = await prisma.flight.findUnique({ where: { id: parseId(req.params.id) } });
        if (!requireRecord(res, flight, 'Flight')) return;
        res.json(flight);
    } catch (err) {
        handleError(res, err);
    }
});

// POST /flights — admin only
router.post('/', verifyAdmin, async (req, res) => {
    const { airlineName, departureCity, arrivalCity, departureTime, arrivalTime, price, durationMinutes, destination_id } = req.body;
    try {
        const newFlight = await prisma.flight.create({
            data: {
                airlineName,
                departureCity,
                arrivalCity,
                departureTime:   new Date(departureTime),
                arrivalTime:     new Date(arrivalTime),
                price:           parseFloat(price),
                durationMinutes: durationMinutes ? parseInt(durationMinutes, 10) : null,
                destinationId:   parseId(destination_id),
            }
        });
        res.status(201).json({ id: newFlight.id });
    } catch (err) {
        handleError(res, err);
    }
});

// PUT /flights/:id — admin only
router.put('/:id', verifyAdmin, async (req, res) => {
    const { airlineName, departureCity, arrivalCity, departureTime, arrivalTime, price, durationMinutes, destination_id } = req.body;
    try {
        const updated = await prisma.flight.update({
            where: { id: parseId(req.params.id) },
            data:  {
                ...(airlineName    && { airlineName }),
                ...(departureCity  && { departureCity }),
                ...(arrivalCity    && { arrivalCity }),
                ...(departureTime  && { departureTime:   new Date(departureTime) }),
                ...(arrivalTime    && { arrivalTime:     new Date(arrivalTime) }),
                ...(price          && { price:           parseFloat(price) }),
                ...(durationMinutes && { durationMinutes: parseInt(durationMinutes, 10) }),
                ...(destination_id && { destinationId:   parseId(destination_id) }),
            }
        });
        res.json(updated);
    } catch (err) {
        if (err.code === 'P2025') return res.status(404).json({ message: 'Flight not found' });
        handleError(res, err);
    }
});

// DELETE /flights/:id — admin only
router.delete('/:id', verifyAdmin, async (req, res) => {
    try {
        await prisma.flight.delete({ where: { id: parseId(req.params.id) } });
        res.json({ message: 'Flight deleted successfully' });
    } catch (err) {
        if (err.code === 'P2025') return res.status(404).json({ message: 'Flight not found' });
        handleError(res, err);
    }
});

module.exports = router;
