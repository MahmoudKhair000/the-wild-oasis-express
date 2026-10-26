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
router.get('/images/:id', auth, getCabinImage);
router.post('/', auth, uploadImage, createCabin);

router.patch('/:cabinId', auth, admin, updateCabin);
router.delete('/:cabinId', auth, admin, deleteCabin);

export { router };

// let t = {
// 	_id: '6acc1b02baf29b728eb3e89a',
// 	created_at: '2026-09-05T00:42:41.693Z',
// 	name: '007',
// 	maxCapacity: '8',
// 	regularPrice: '600',
// 	discount: '100',
// 	description:
// 		'Accommodate your large group or multiple families in the spacious and grand wooden cabin 007. Designed to comfortably fit up to 8 people, this cabin offers a secluded retreat in the heart of beautiful forests and mountains. Inside, the cabin features warm and inviting interiors crafted from quality wood, multiple living areas with fireplace, and a fully-equipped kitchen. The bedrooms are comfortable and equipped with en-suite bathrooms. The cabin has a private deck with a hot tub and outdoor seating area, perfect for taking in the natural surroundings.',
// 	image:
// 		'https://hrqxtwqgkuljmyfbiohl.supabase.co/storage/v1/object/public/cabin-images/cabin-007.jpg',
// };
