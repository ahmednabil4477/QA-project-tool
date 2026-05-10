const express = require('express');
const prisma = require('../prismaClient');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
    const { flight_id } = req.body;
    const user_id = req.user.id;

    try {
        // Fetch flight price to save as totalPrice
        const flight = await prisma.flight.findUnique({
            where: { id: parseInt(flight_id) }
        });

        if (!flight) {
            return res.status(404).json({ message: "Flight not found" });
        }

        const booking = await prisma.booking.create({
            data: {
                userId: user_id,
                flightId: parseInt(flight_id),
                date: new Date(),
                totalPrice: flight.price
            }
        });
        
        res.status(201).json({ message: "Booking created successfully", booking_id: booking.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/my-bookings', verifyToken, async (req, res) => {
    try {
        const bookings = await prisma.booking.findMany({
            where: { userId: req.user.id },
            include: { 
                flight: {
                    include: {
                        destination: true
                    }
                }
            }
        });
        
        const formatted = bookings.map(b => ({
            ...b,
            airlineName: b.flight.airlineName,
            departureCity: b.flight.departureCity,
            arrivalCity: b.flight.arrivalCity,
            departureTime: b.flight.departureTime,
            totalPrice: b.flight.price,
            destinationName: b.flight.destination.name,
            destinationImage: b.flight.destination.imageUrl
        }));
        
        res.json(formatted);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', verifyToken, async (req, res) => {
    try {
        const booking = await prisma.booking.findUnique({
            where: { id: parseInt(req.params.id) }
        });
        
        if (!booking) return res.status(404).json({ message: "Booking not found" });
        
        if (booking.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied" });
        }

        const formatted = {
            ...booking,
            user_id: booking.userId,
            flight_id: booking.flightId
        };

        res.json(formatted);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/', verifyAdmin, async (req, res) => {
    try {
        const bookings = await prisma.booking.findMany({
            include: { flight: true, user: true }
        });
        
        const formatted = bookings.map(b => ({
            ...b,
            userName: `${b.user.firstName} ${b.user.lastName}`,
            airlineName: b.flight.airlineName,
            departureCity: b.flight.departureCity,
            arrivalCity: b.flight.arrivalCity,
            departureTime: b.flight.departureTime,
            totalPrice: b.flight.price
        }));
        
        res.json(formatted);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', verifyAdmin, async (req, res) => {
    try {
        await prisma.booking.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.json({ message: "Booking deleted successfully" });
    } catch (err) {
        if (err.code === 'P2025') return res.status(404).json({ message: "Booking not found" });
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', verifyAdmin, async (req, res) => {
    const { status } = req.body;
    try {
        const updatedBooking = await prisma.booking.update({
            where: { id: parseInt(req.params.id) },
            data: { ...(status && { status }) }
        });
        res.json(updatedBooking);
    } catch (err) {
        if (err.code === 'P2025') return res.status(404).json({ message: "Booking not found" });
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
