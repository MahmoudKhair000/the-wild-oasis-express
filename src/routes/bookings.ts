import express, { type Router } from 'express';
import {
	createBooking,
	editBooking,
	getAllBookings,
	getBooking,
	getCabinBookedDates,
	deleteBooking,
	confirmPaid,
} from '../controllers/bookings.ts';
import { auth } from '../middlewares/auth.ts';
import { admin } from '../middlewares/admin.ts';

const router: Router = express.Router();

router.get('/', getAllBookings);
router.get('/:id', getBooking);

router.post('/new', auth, createBooking);
router.post('/dates/:cabinId', auth, getCabinBookedDates);
router.post('/pay/:id', auth, admin, confirmPaid);

router.patch('/:id', auth, editBooking);
router.delete('/:id', auth, deleteBooking);

export { router };
