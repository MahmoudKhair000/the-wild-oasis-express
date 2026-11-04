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

/**
 * @swagger
 * /guests:
 *   put:
 *     summary: Insert sample guests
 *     tags: [Guests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201: { description: Sample guests inserted }
 */
router.put('/', auth, admin, putSampleGuests);
/**
 * @swagger
 * /guests:
 *   delete:
 *     summary: Delete all guests
 *     tags: [Guests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Guests deleted }
 */
router.delete('/', auth, admin, deleteSampleGuests);
/* ------ ------ The Main API ------ ------ */
/**
 * @swagger
 * /guests:
 *   get:
 *     summary: List guests
 *     tags: [Guests]
 *     responses:
 *       200: { description: Guests returned }
 */
router.get('/', getAllGuests);
/**
 * @swagger
 * /guests/{guestId}:
 *   get:
 *     summary: Get a guest
 *     tags: [Guests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: guestId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Guest returned }
 *       404: { description: Guest not found }
 */
router.get('/:guestId', auth, getGuest);
/**
 * @swagger
 * /guests:
 *   post:
 *     summary: Create a guest
 *     tags: [Guests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/GuestInput' }
 *     responses:
 *       201: { description: Guest created }
 *       400: { description: Invalid guest data }
 */
router.post('/', auth, createGuest);

/**
 * @swagger
 * /guests/{guestId}:
 *   patch:
 *     summary: Update a guest
 *     tags: [Guests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: guestId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/GuestUpdateInput' }
 *     responses:
 *       200: { description: Guest updated }
 *       403: { description: Administrator access required }
 */
router.patch('/:guestId', auth, admin, editGuest);
/**
 * @swagger
 * /guests/{guestId}:
 *   delete:
 *     summary: Delete a guest
 *     tags: [Guests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: guestId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Guest deleted }
 *       403: { description: Administrator access required }
 *       404: { description: Guest not found }
 */
router.delete('/:guestId', auth, admin, deleteGuest);

export { router };
