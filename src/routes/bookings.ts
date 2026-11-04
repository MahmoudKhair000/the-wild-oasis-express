import express, { type Router } from 'express';
import {
	checkinBooking,
	checkoutBooking,
	confirmPaid,
	createBooking,
	deleteBooking,
	editBooking,
	getAllBookings,
	getBooking,
	getBookingsAfterDate,
	getCabinBookedDates,
	getGuestBookings,
	getStaysAfterDate,
	getTodayActivity,
} from '../controllers/bookings.ts';
import { admin } from '../middlewares/admin.ts';
import { auth } from '../middlewares/auth.ts';

const router: Router = express.Router();

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: List bookings
 *     tags: [Bookings]
 *     parameters:
 *       - in: query
 *         name: filter
 *         schema: { type: string, example: unconfirmed }
 *       - in: query
 *         name: sortBy
 *         description: Sort by startDate or totalPrice, optionally followed by -desc.
 *         schema: { type: string, example: startDate-desc }
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, minimum: 1, default: 10 }
 *     responses:
 *       200: { description: Bookings returned }
 *       500: { description: Database error }
 */
router.get('/', getAllBookings);

/**
 * @swagger
 * /bookings/today-activity:
 *   get:
 *     summary: Get today's booking activity
 *     description: Returns bookings starting today that are not checked out.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Today's activity returned }
 *       401: { description: Authentication required }
 *       500: { description: Database error }
 */
router.get('/today-activity', auth, getTodayActivity);

/**
 * @swagger
 * /bookings/created-after-date/{date}:
 *   get:
 *     summary: List bookings created from a date through today
 *     description: The date range is inclusive and uses UTC day boundaries, from midnight on the requested date through the end of today.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         description: Start date of the inclusive range.
 *         schema:
 *           type: string
 *           format: date
 *           example: '2026-11-03'
 *     responses:
 *       200: { description: Bookings in the creation-date range returned }
 *       400: { description: Invalid date parameter }
 *       401: { description: Authentication required }
 *       500: { description: Database error }
 */
router.get('/created-after-date/:date', auth, getBookingsAfterDate);

/**
 * @swagger
 * /bookings/stays-after-date/{date}:
 *   get:
 *     summary: List stays starting after a date and through today
 *     description: Returns stays whose startDate is strictly after the requested date and no later than today.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         description: Start-date lower bound (exclusive).
 *         schema:
 *           type: string
 *           format: date
 *           example: '2026-11-03'
 *     responses:
 *       200: { description: Stays in the start-date range returned }
 *       400: { description: Invalid date parameter }
 *       401: { description: Authentication required }
 *       500: { description: Database error }
 */
router.get('/stays-after-date/:date', auth, getStaysAfterDate);

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     summary: Get a booking and its cabin and guest
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Booking returned }
 *       404: { description: Booking or related resource not found }
 */
router.get('/:id', auth, getBooking);

/**
 * @swagger
 * /bookings/dates/{cabinId}:
 *   get:
 *     summary: Get booked dates for a cabin
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cabinId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Booked dates returned }
 */
router.get('/dates/:cabinId', auth, getCabinBookedDates);
/**
 * @swagger
 * /bookings/guest/{guestId}:
 *   get:
 *     summary: List bookings for a guest
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: guestId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Guest bookings returned }
 */
router.get('/guest/:guestId', auth, getGuestBookings);

/**
 * @swagger
 * /bookings/new:
 *   post:
 *     summary: Create a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/BookingInput' }
 *     responses:
 *       200: { description: Booking created }
 *       403: { description: Client may not set payment or status fields }
 *       404: { description: Cabin or guest not found }
 */
router.post('/new', auth, createBooking);
/**
 * @swagger
 * /bookings/pay/{id}:
 *   post:
 *     summary: Mark a booking as paid
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Booking payment confirmed }
 *       401: { description: Authentication required }
 *       403: { description: Administrator access required }
 */
router.post('/pay/:id', auth, admin, confirmPaid);
/**
 * @swagger
 * /bookings/checkin/{id}:
 *   post:
 *     summary: Check in a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Booking checked in }
 *       401: { description: Authentication required }
 *       403: { description: Administrator access required }
 */
router.post('/checkin/:id', auth, admin, checkinBooking);
/**
 * @swagger
 * /bookings/checkout/{id}:
 *   post:
 *     summary: Check out a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Booking checked out }
 *       401: { description: Authentication required }
 *       403: { description: Administrator access required }
 */
router.post('/checkout/:id', auth, admin, checkoutBooking);

/**
 * @swagger
 * /bookings/{id}:
 *   patch:
 *     summary: Update a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/BookingUpdateInput' }
 *     responses:
 *       200: { description: Booking updated }
 *       404: { description: Booking not found }
 */
router.patch('/:id', auth, editBooking);
/**
 * @swagger
 * /bookings/{id}:
 *   delete:
 *     summary: Delete a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Booking deleted }
 *       404: { description: Booking not found }
 */
router.delete('/:id', auth, deleteBooking);

export { router };
