const express = require('express');
const prisma = require('../prismaClient');
const { verifyAdmin } = require('../middleware/auth');
const { parseId, handleError, requireRecord } = require('../utils/helpers');
const router = express.Router();

// GET /flights — public, optional filters: departureCity, arrivalCity, date
router.get('/', async (req, res) => {
    const { departureCity, arrivalCity, date } = req.query;
    const where = {};

    if (departureCity) where.departureCity = { contains: departureCity, mode: 'insensitive' };
    if (arrivalCity) where.arrivalCity = { contains: arrivalCity, mode: 'insensitive' };
    if (date) {
        const startDate = new Date(date);
        const endDate = new Date(date);
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


module.exports = router;
