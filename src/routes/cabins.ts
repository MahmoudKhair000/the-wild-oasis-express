import express, { type Router } from 'express';
import {
	createCabin,
	deleteCabin,
	deleteSampleCabins,
	duplicateCabin,
	getAllCabins,
	getCabin,
	getCabinImage,
	putSampleCabins,
	updateCabin,
} from '../controllers/cabins.ts';
import { admin } from '../middlewares/admin.ts';
import { auth } from '../middlewares/auth.ts';
import { uploadImage } from '../services/cabinUploader.ts';

const router: Router = express.Router();

/**
 * @swagger
 * /cabins/sample:
 *   put:
 *     summary: Insert sample cabins
 *     tags: [Cabins]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201: { description: Sample cabins inserted }
 *       500: { description: Database error }
 */
router.put('/sample', auth, putSampleCabins);
/**
 * @swagger
 * /cabins:
 *   delete:
 *     summary: Delete all cabins
 *     tags: [Cabins]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Cabins deleted }
 */
router.delete('/', auth, deleteSampleCabins);
/* ------ ------ The Main API ------ ------ */
/**
 * @swagger
 * /cabins:
 *   get:
 *     summary: List cabins
 *     tags: [Cabins]
 *     responses:
 *       200: { description: Cabins returned }
 */
router.get('/', getAllCabins);
/**
 * @swagger
 * /cabins/{cabinId}:
 *   get:
 *     summary: Get a cabin
 *     tags: [Cabins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cabinId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Cabin returned }
 *       404: { description: Cabin not found }
 */
router.get('/:cabinId', auth, getCabin);

/**
 * @swagger
 * /cabins/images/{id}:
 *   get:
 *     summary: Download a cabin image
 *     tags: [Cabins]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Image file
 *         content:
 *           image/*:
 *             schema: { type: string, format: binary }
 *       404: { description: Image not found }
 */
router.get('/images/:id', getCabinImage);

/**
 * @swagger
 * /cabins:
 *   post:
 *     summary: Create a cabin
 *     tags: [Cabins]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema: { $ref: '#/components/schemas/CabinInput' }
 *     responses:
 *       201: { description: Cabin created }
 *       400: { description: Invalid cabin data or image }
 */
router.post('/', auth, uploadImage, createCabin);
/**
 * @swagger
 * /cabins/duplicate/{cabinId}:
 *   post:
 *     summary: Duplicate a cabin
 *     tags: [Cabins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cabinId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema: { $ref: '#/components/schemas/CabinInput' }
 *     responses:
 *       201: { description: Cabin duplicated }
 *       404: { description: Source cabin not found }
 */
router.post('/duplicate/:cabinId', auth, uploadImage, duplicateCabin);

/**
 * @swagger
 * /cabins/{cabinId}:
 *   patch:
 *     summary: Update a cabin
 *     tags: [Cabins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cabinId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema: { $ref: '#/components/schemas/CabinUpdateInput' }
 *     responses:
 *       200: { description: Cabin updated }
 *       403: { description: Administrator access required }
 */
router.patch('/:cabinId', auth, admin, uploadImage, updateCabin);
/**
 * @swagger
 * /cabins/{cabinId}:
 *   delete:
 *     summary: Delete a cabin
 *     tags: [Cabins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cabinId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Cabin deleted }
 *       403: { description: Administrator access required }
 *       404: { description: Cabin not found }
 */
router.delete('/:cabinId', auth, admin, deleteCabin);

export { router };
