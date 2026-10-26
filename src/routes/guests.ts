import express, { type Router } from 'express';
import {
	createGuest,
	deleteGuest,
	deleteSampleGuests,
	editGuest,
	getAllGuests,
	getGuest,
	putSampleGuests,
} from '../controllers/guests.ts';
import { admin } from '../middlewares/admin.ts';
import { auth } from '../middlewares/auth.ts';

const router: Router = express.Router();

router.put('/', auth, admin, putSampleGuests);
router.delete('/', auth, admin, deleteSampleGuests);
/* ------ ------ The Main API ------ ------ */
router.get('/', getAllGuests);
router.get('/:guestId', auth, getGuest);
router.post('/', auth, createGuest);

router.patch('/:guestId', auth, admin, editGuest);
router.delete('/:guestId', auth, admin, deleteGuest);

export { router };

