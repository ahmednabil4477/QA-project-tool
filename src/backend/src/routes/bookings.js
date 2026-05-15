const express = require('express');
const prisma = require('../prismaClient');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const { parseId, handleError, requireRecord } = require('../utils/helpers');
const router = express.Router();

// POST /bookings — create a booking for the authenticated user
router.post('/', verifyToken, async (req, res) => {
    const { flight_id } = req.body;
    try {
        const flight = await prisma.flight.findUnique({ where: { id: parseId(flight_id) } });
        if (!requireRecord(res, flight, 'Flight')) return;

        const booking = await prisma.booking.create({
            data: {
                userId: req.user.id,
                flightId: parseId(flight_id),
                date: new Date(),
                totalPrice: flight.price,
            }
        });
        res.status(201).json({ message: 'Booking created successfully', booking_id: booking.id });
    } catch (err) {
        handleError(res, err);
    }
});

// GET /bookings/my-bookings — authenticated user's own bookings
router.get('/my-bookings', verifyToken, async (req, res) => {
    try {
        const bookings = await prisma.booking.findMany({
            where: { userId: req.user.id },
            include: { flight: { include: { destination: true } } }
        });

        res.json(bookings.map((b) => ({
            ...b,
            airlineName: b.flight.airlineName,
            departureCity: b.flight.departureCity,
            arrivalCity: b.flight.arrivalCity,
            departureTime: b.flight.departureTime,
            totalPrice: b.flight.price,
            destinationName: b.flight.destination.name,
            destinationImage: b.flight.destination.imageUrl,
        })));
    } catch (err) {
        handleError(res, err);
    }
});

// GET /bookings/:id — single booking (owner or admin)
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const booking = await prisma.booking.findUnique({ where: { id: parseId(req.params.id) } });
        if (!requireRecord(res, booking, 'Booking')) return;

        if (booking.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        res.json(booking);
    } catch (err) {
        handleError(res, err);
    }
});

// GET /bookings — admin: all bookings
router.get('/', verifyAdmin, async (req, res) => {
    try {
        const bookings = await prisma.booking.findMany({
            include: { flight: true, user: true }
        });

        res.json(bookings.map((b) => ({
            ...b,
            userName: `${b.user.firstName} ${b.user.lastName}`,
            airlineName: b.flight.airlineName,
            departureCity: b.flight.departureCity,
            arrivalCity: b.flight.arrivalCity,
            departureTime: b.flight.departureTime,
            totalPrice: b.flight.price,
        })));
    } catch (err) {
        handleError(res, err);
    }
});

// DELETE /bookings/:id — admin only
router.delete('/:id', verifyAdmin, async (req, res) => {
    try {
        await prisma.booking.delete({ where: { id: parseId(req.params.id) } });
        res.json({ message: 'Booking deleted successfully' });
    } catch (err) {
        if (err.code === 'P2025') return res.status(404).json({ message: 'Booking not found' });
        handleError(res, err);
    }
});

module.exports = router;
