import type { Request, Response } from 'express';
import { cabinsModel } from '../models/cabins.ts';

/* -- Sample data api -- */
const sampleCabins = [
	{
		id: 387,
		created_at: '2026-09-05 00:42:41.693114+00',
		name: '001',
		maxCapacity: 2,
		regularPrice: 250,
		discount: 0,
		description:
			'Discover the ultimate luxury getaway for couples in the cozy wooden cabin 001. Nestled in a picturesque forest, this stunning cabin offers a secluded and intimate retreat. Inside, enjoy modern high-quality wood interiors, a comfortable seating area, a fireplace and a fully-equipped kitchen. The plush king-size bed, dressed in fine linens guarantees a peaceful nights sleep. Relax in the spa-like shower and unwind on the private deck with hot tub.',
		image:
			'https://hrqxtwqgkuljmyfbiohl.supabase.co/storage/v1/object/public/cabin-images/cabin-001.jpg',
	},
	{
		id: 388,
		created_at: '2026-09-05 00:42:41.693114+00',
		name: '002',
		maxCapacity: 2,
		regularPrice: 350,
		discount: 25,
		description:
			'Escape to the serenity of nature and indulge in luxury in our cozy cabin 002. Perfect for couples, this cabin offers a secluded and intimate retreat in the heart of a picturesque forest. Inside, you will find warm and inviting interiors crafted from high-quality wood, a comfortable living area, a fireplace and a fully-equipped kitchen. The luxurious bedroom features a plush king-size bed and spa-like shower. Relax on the private deck with hot tub and take in the beauty of nature.',
		image:
			'https://hrqxtwqgkuljmyfbiohl.supabase.co/storage/v1/object/public/cabin-images/cabin-002.jpg',
	},
	{
		id: 389,
		created_at: '2026-09-05 00:42:41.693114+00',
		name: '003',
		maxCapacity: 4,
		regularPrice: 300,
		discount: 0,
		description:
			'Experience luxury family living in our medium-sized wooden cabin 003. Perfect for families of up to 4 people, this cabin offers a comfortable and inviting space with all modern amenities. Inside, you will find warm and inviting interiors crafted from high-quality wood, a comfortable living area, a fireplace, and a fully-equipped kitchen. The bedrooms feature plush beds and spa-like bathrooms. The cabin has a private deck with a hot tub and outdoor seating area, perfect for taking in the natural surroundings.',
		image:
			'https://hrqxtwqgkuljmyfbiohl.supabase.co/storage/v1/object/public/cabin-images/cabin-003.jpg',
	},
	{
		id: 390,
		created_at: '2026-09-05 00:42:41.693114+00',
		name: '004',
		maxCapacity: 4,
		regularPrice: 500,
		discount: 50,
		description:
			'Indulge in the ultimate luxury family vacation in this medium-sized cabin 004. Designed for families of up to 4, this cabin offers a sumptuous retreat for the discerning traveler. Inside, the cabin boasts of opulent interiors crafted from the finest quality wood, a comfortable living area, a fireplace, and a fully-equipped gourmet kitchen. The bedrooms are adorned with plush beds and spa-inspired en-suite bathrooms. Step outside to your private deck and soak in the natural surroundings while relaxing in your own hot tub.',
		image:
			'https://hrqxtwqgkuljmyfbiohl.supabase.co/storage/v1/object/public/cabin-images/cabin-004.jpg',
	},
	{
		id: 391,
		created_at: '2026-09-05 00:42:41.693114+00',
		name: '005',
		maxCapacity: 6,
		regularPrice: 350,
		discount: 0,
		description:
			'Enjoy a comfortable and cozy getaway with your group or family in our spacious cabin 005. Designed to accommodate up to 6 people, this cabin offers a secluded retreat in the heart of nature. Inside, the cabin features warm and inviting interiors crafted from quality wood, a living area with fireplace, and a fully-equipped kitchen. The bedrooms are comfortable and equipped with en-suite bathrooms. Step outside to your private deck and take in the natural surroundings while relaxing in your own hot tub.',
		image:
			'https://hrqxtwqgkuljmyfbiohl.supabase.co/storage/v1/object/public/cabin-images/cabin-005.jpg',
	},
	{
		id: 392,
		created_at: '2026-09-05 00:42:41.693114+00',
		name: '006',
		maxCapacity: 6,
		regularPrice: 800,
		discount: 100,
		description:
			'Experience the epitome of luxury with your group or family in our spacious wooden cabin 006. Designed to comfortably accommodate up to 6 people, this cabin offers a lavish retreat in the heart of nature. Inside, the cabin features opulent interiors crafted from premium wood, a grand living area with fireplace, and a fully-equipped gourmet kitchen. The bedrooms are adorned with plush beds and spa-like en-suite bathrooms. Step outside to your private deck and soak in the natural surroundings while relaxing in your own hot tub.',
		image:
			'https://hrqxtwqgkuljmyfbiohl.supabase.co/storage/v1/object/public/cabin-images/cabin-006.jpg',
	},
	{
		id: 393,
		created_at: '2026-09-05 00:42:41.693114+00',
		name: '007',
		maxCapacity: 8,
		regularPrice: 600,
		discount: 100,
		description:
			'Accommodate your large group or multiple families in the spacious and grand wooden cabin 007. Designed to comfortably fit up to 8 people, this cabin offers a secluded retreat in the heart of beautiful forests and mountains. Inside, the cabin features warm and inviting interiors crafted from quality wood, multiple living areas with fireplace, and a fully-equipped kitchen. The bedrooms are comfortable and equipped with en-suite bathrooms. The cabin has a private deck with a hot tub and outdoor seating area, perfect for taking in the natural surroundings.',
		image:
			'https://hrqxtwqgkuljmyfbiohl.supabase.co/storage/v1/object/public/cabin-images/cabin-007.jpg',
	},
	{
		id: 394,
		created_at: '2026-09-05 00:42:41.693114+00',
		name: '008',
		maxCapacity: 10,
		regularPrice: 1400,
		discount: 0,
		description:
			"Experience the epitome of luxury and grandeur with your large group or multiple families in our grand cabin 008. This cabin offers a lavish retreat that caters to all your needs and desires. The cabin features an opulent design and boasts of high-end finishes, intricate details and the finest quality wood throughout. Inside, the cabin features multiple grand living areas with fireplaces, a formal dining area, and a gourmet kitchen that is a chef's dream. The bedrooms are designed for ultimate comfort and luxury, with plush beds and en-suite spa-inspired bathrooms. Step outside and immerse yourself in the beauty of nature from your private deck, featuring a luxurious hot tub and ample seating areas for ultimate relaxation and enjoyment.",
		image:
			'https://hrqxtwqgkuljmyfbiohl.supabase.co/storage/v1/object/public/cabin-images/cabin-008.jpg',
	},
];

const putSampleCabins = async (req: Request, res: Response): Promise<void> => {
	try {
		const cabinsDoc = await cabinsModel.insertMany(sampleCabins);

		res.status(201).json({
			// 201 Created: sample cabins were inserted.
			ok: true,
			message: 'Success !!',
			data: cabinsDoc,
		});
	} catch (err: unknown) {
		const errorMessage =
			err instanceof Error ? err.message : 'Something went wrong';
		res.status(500).json({
			// 500 Internal Server Error: the operation failed unexpectedly.
			ok: false,
			message: errorMessage,
		});
	}
};

const deleteSampleCabins = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		await cabinsModel.deleteMany();

		res.status(200).json({
			// 200 OK: cabins were deleted and a confirmation is returned.
			ok: true,
			message: 'Success !',
			data: 'LOL!! all deleted',
		});
	} catch (err: unknown) {
		const errMsg =
			err instanceof Error ? err.message : 'Something Went Wrong !!';

		res.status(500).json({
			// 500 Internal Server Error: the operation failed unexpectedly.
			ok: false,
			message: errMsg,
		});
	}
};

/* -- Start api -- */
const getAllCabins = async (req: Request, res: Response): Promise<void> => {
	try {
		const cabins = await cabinsModel.find();
		res.status(200).json({
			// 200 OK: the cabin collection was retrieved.
			ok: true,
			message: 'Got cabins successfully!',
			data: cabins,
		});
	} catch (err: any) {
		res.status(500).json({
			// 500 Internal Server Error: the operation failed unexpectedly.
			ok: false,
			message: err.message,
		});
	}
};

const getCabin = async (req: Request, res: Response): Promise<void> => {
	const idParam = req.params.cabinId;
	try {
		const cabin = await cabinsModel.findOne({ _id: idParam });

		if (!cabin) {
			res.status(404).json({
				// 404 Not Found: no cabin has this ID.
				ok: false,
				message: `Cabin ${idParam} was not found`,
			});
			return;
		}

		res.status(200).json({
			// 200 OK: the requested cabin was found.
			ok: true,
			message: `Found cabin ${idParam}`,
			data: cabin,
		});
	} catch (err: unknown) {
		const errMsg =
			err instanceof Error
				? err.message
				: `Something went wrong finding 'cabin:${idParam}' !!`;

		res.status(500).json({
			// 500 Internal Server Error: the operation failed unexpectedly.
			ok: false,
			message: errMsg,
		});
	}
};

const createCabin = async (req: Request, res: Response): Promise<void> => {
	try {
		const newCabin = req.body;
		const cabinDoc = await cabinsModel.create(newCabin);

		res.status(201).json({
			// 201 Created: the cabin was created.
			ok: true,
			message: 'Cabin created successfully!',
			data: cabinDoc,
		});
	} catch (err: unknown) {
		const errMsg =
			err instanceof Error ? err.message : 'Something Went Wrong !!';

		res.status(500).json({
			// 500 Internal Server Error: the operation failed unexpectedly.
			ok: false,
			message: errMsg,
		});
	}
};

const updateCabin = async (req: Request, res: Response): Promise<void> => {
	try {
		const update = req.body;
		const updatedCabin = await cabinsModel.findOneAndUpdate(
			{ _id: req.params.cabinId },
			{ ...update, updated_at: new Date() },
			{ returnDocument: 'after', runValidators: true },
		);

		if (!updatedCabin) {
			res.status(404).json({
				// 404 Not Found: no cabin with this ID can be updated.
				ok: false,
				message: `Cabin ${req.params.cabinId} was not found`,
			});
			return;
		}

		res.status(200).json({
			// 200 OK: the existing cabin was updated.
			ok: true,
			message: `updated cabin ${req.params.cabinId}`,
			params: req.params,
			data: updatedCabin,
		});
	} catch (err: unknown) {
		const errMsg =
			err instanceof Error ? err.message : 'Something went wrong !!';

		res.status(500).json({
			// 500 Internal Server Error: the operation failed unexpectedly.
			ok: false,
			message: errMsg,
		});
	}
};

const deleteCabin = async (req: Request, res: Response): Promise<void> => {
	try {
		const id = req.params.cabinId;

		const deletedCabin = await cabinsModel.findOneAndDelete({ _id: id });

		if (!deletedCabin) {
			res.status(404).json({
				// 404 Not Found: no cabin with this ID can be deleted.
				ok: false,
				message: `Cabin ${id} was not found`,
			});
			return;
		}

		res.status(200).json({
			// 200 OK: the cabin was deleted and a confirmation is returned.
			ok: true,
			message: `deleted 'cabin:${id}' successfully !!`,
		});
	} catch (err: unknown) {
		const errMsg =
			err instanceof Error ? err.message : 'Something went wrong !';

		res.status(500).json({
			// 500 Internal Server Error: the operation failed unexpectedly.
			ok: false,
			message: errMsg,
		});
	}
};

export {
	createCabin,
	deleteCabin,
	deleteSampleCabins,
	getAllCabins,
	getCabin,
	putSampleCabins,
	updateCabin,
};
