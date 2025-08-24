import express from 'express';
import { createBooking, getAllBookings, getBooking, getBookingByUser, updateBooking } from '../controllers/bookingController.js';
import { verifyAdmin } from '../utils/verifyToken.js';

const bookingRoute = express.Router();

// Create a new review for a tour
bookingRoute.post('/', createBooking);

bookingRoute.get('/:id', getBooking);

bookingRoute.put('/:id', updateBooking);

bookingRoute.get('/user/:userId', getBookingByUser);

bookingRoute.get('/', getAllBookings);

export default bookingRoute
