import express, { type Router } from 'express';
import {
	createCabin,
	deleteCabin,
	deleteSampleCabins,
	getAllCabins,
	getCabin,
	getCabinImage,
	putSampleCabins,
	updateCabin,
} from '../controllers/cabins.ts';
import { admin } from '../middlewares/admin.ts';
import { auth } from '../middlewares/auth.ts';
import { uploadImage } from '../services/uploader.ts';

const router: Router = express.Router();

router.put('/', auth, putSampleCabins);
router.delete('/', auth, deleteSampleCabins);
/* ------ ------ The Main API ------ ------ */
router.get('/', getAllCabins);
router.get('/:cabinId', auth, getCabin);
router.get('/images/:id', getCabinImage);
router.post('/', auth, uploadImage, createCabin);

router.patch('/:cabinId', auth, admin, uploadImage, updateCabin);
router.delete('/:cabinId', auth, admin, deleteCabin);

export { router };
