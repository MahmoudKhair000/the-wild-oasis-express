import type { Request, Response } from 'express';
import { guestsModel } from '../models/guests.ts';
/* Some sample stuff */
const sampleGuests = [
	{
		id: 1120,
		created_at: '2026-09-24 11:27:58.838977+00',
		fullName: 'Mostafa Ali',
		email: 'mostafakhairsayed@gmail.com',
		nationalID: null,
		nationality: null,
		countryFlag: null,
	},
	{
		id: 1119,
		created_at: '2026-09-24 02:47:59.821969+00',
		fullName: 'Mahmoud Al-Seyyid',
		email: 'mahmoudkhair01010789887@gmail.com',
		nationalID: '30303030303030',
		nationality: 'Egypt',
		countryFlag: 'https://flags.restcountries.com/v5/svg/eg.svg',
	},
	{
		id: 1063,
		created_at: '2026-09-05 00:42:41.465394+00',
		fullName: 'Jonas Schmedtmann',
		email: 'hello@jonas.io',
		nationalID: '3525436345',
		nationality: 'Portugal',
		countryFlag: 'https://flagcdn.com/pt.svg',
	},
	{
		id: 1064,
		created_at: '2026-09-05 00:42:41.465394+00',
		fullName: 'Jonathan Smith',
		email: 'johnsmith@test.eu',
		nationalID: '4534593454',
		nationality: 'Great Britain',
		countryFlag: 'https://flagcdn.com/gb.svg',
	},
	{
		id: 1065,
		created_at: '2026-09-05 00:42:41.465394+00',
		fullName: 'Jonatan Johansson',
		email: 'jonatan@example.com',
		nationalID: '9374074454',
		nationality: 'Finland',
		countryFlag: 'https://flagcdn.com/fi.svg',
	},
	{
		id: 1066,
		created_at: '2026-09-05 00:42:41.465394+00',
		fullName: 'Jonas Mueller',
		email: 'jonas@example.eu',
		nationalID: '1233212288',
		nationality: 'Germany',
		countryFlag: 'https://flagcdn.com/de.svg',
	},
	{
		id: 1067,
		created_at: '2026-09-05 00:42:41.465394+00',
		fullName: 'Jonas Anderson',
		email: 'anderson@example.com',
		nationalID: '0988520146',
		nationality: 'Bolivia (Plurinational State of)',
		countryFlag: 'https://flagcdn.com/bo.svg',
	},
	{
		id: 1068,
		created_at: '2026-09-05 00:42:41.465394+00',
		fullName: 'Jonathan Williams',
		email: 'jowi@gmail.com',
		nationalID: '633678543',
		nationality: 'United States of America',
		countryFlag: 'https://flagcdn.com/us.svg',
	},
	{
		id: 1069,
		created_at: '2026-09-05 00:42:41.465394+00',
		fullName: 'Emma Watson',
		email: 'emma@gmail.com',
		nationalID: '1234578901',
		nationality: 'United Kingdom',
		countryFlag: 'https://flagcdn.com/gb.svg',
	},
	{
		id: 1070,
		created_at: '2026-09-05 00:42:41.465394+00',
		fullName: 'Mohammed Ali',
		email: 'mohammedali@yahoo.com',
		nationalID: '987543210',
		nationality: 'Egypt',
		countryFlag: 'https://flagcdn.com/eg.svg',
	},
	{
		id: 1071,
		created_at: '2026-09-05 00:42:41.465394+00',
		fullName: 'Maria Rodriguez',
		email: 'maria@gmail.com',
		nationalID: '1098765321',
		nationality: 'Spain',
		countryFlag: 'https://flagcdn.com/es.svg',
	},
	{
		id: 1072,
		created_at: '2026-09-05 00:42:41.465394+00',
		fullName: 'Li Mei',
		email: 'li.mei@hotmail.com',
		nationalID: '102934756',
		nationality: 'China',
		countryFlag: 'https://flagcdn.com/cn.svg',
	},
	{
		id: 1073,
		created_at: '2026-09-05 00:42:41.465394+00',
		fullName: 'Khadija Ahmed',
		email: 'khadija@gmail.com',
		nationalID: '1023457890',
		nationality: 'Sudan',
		countryFlag: 'https://flagcdn.com/sd.svg',
	},
	{
		id: 1074,
		created_at: '2026-09-05 00:42:41.465394+00',
		fullName: 'Gabriel Silva',
		email: 'gabriel@gmail.com',
		nationalID: '109283465',
		nationality: 'Brazil',
		countryFlag: 'https://flagcdn.com/br.svg',
	},
	{
		id: 1075,
		created_at: '2026-09-05 00:42:41.465394+00',
		fullName: 'Maria Gomez',
		email: 'maria@example.com',
		nationalID: '108765421',
		nationality: 'Mexico',
		countryFlag: 'https://flagcdn.com/mx.svg',
	},
	{
		id: 1076,
		created_at: '2026-09-05 00:42:41.465394+00',
		fullName: 'Ahmed Hassan',
		email: 'ahmed@gmail.com',
		nationalID: '1077777777',
		nationality: 'Egypt',
		countryFlag: 'https://flagcdn.com/eg.svg',
	},
	{
		id: 1077,
		created_at: '2026-09-05 00:42:41.465394+00',
		fullName: 'John Doe',
		email: 'johndoe@gmail.com',
		nationalID: '3245908744',
		nationality: 'United States',
		countryFlag: 'https://flagcdn.com/us.svg',
	},
	{
		id: 1078,
		created_at: '2026-09-05 00:42:41.465394+00',
		fullName: 'Fatima Ahmed',
		email: 'fatima@example.com',
		nationalID: '1089999363',
		nationality: 'Pakistan',
		countryFlag: 'https://flagcdn.com/pk.svg',
	},
	{
		id: 1079,
		created_at: '2026-09-05 00:42:41.465394+00',
		fullName: 'David Smith',
		email: 'david@gmail.com',
		nationalID: '44450960283',
		nationality: 'Australia',
		countryFlag: 'https://flagcdn.com/au.svg',
	},
	{
		id: 1080,
		created_at: '2026-09-05 00:42:41.465394+00',
		fullName: 'Marie Dupont',
		email: 'marie@gmail.com',
		nationalID: '06934233728',
		nationality: 'France',
		countryFlag: 'https://flagcdn.com/fr.svg',
	},
	{
		id: 1081,
		created_at: '2026-09-05 00:42:41.465394+00',
		fullName: 'Ramesh Patel',
		email: 'ramesh@gmail.com',
		nationalID: '9875412303',
		nationality: 'India',
		countryFlag: 'https://flagcdn.com/in.svg',
	},
	{
		id: 1082,
		created_at: '2026-09-05 00:42:41.465394+00',
		fullName: 'Fatimah Al-Sayed',
		email: 'fatimah@gmail.com',
		nationalID: '0123456789',
		nationality: 'Kuwait',
		countryFlag: 'https://flagcdn.com/kw.svg',
	},
	{
		id: 1083,
		created_at: '2026-09-05 00:42:41.465394+00',
		fullName: 'Nina Williams',
		email: 'nina@hotmail.com',
		nationalID: '2345678901',
		nationality: 'South Africa',
		countryFlag: 'https://flagcdn.com/za.svg',
	},
	{
		id: 1084,
		created_at: '2026-09-05 00:42:41.465394+00',
		fullName: 'Taro Tanaka',
		email: 'taro@gmail.com',
		nationalID: '3456789012',
		nationality: 'Japan',
		countryFlag: 'https://flagcdn.com/jp.svg',
	},
	{
		id: 1085,
		created_at: '2026-09-05 00:42:41.465394+00',
		fullName: 'Abdul Rahman',
		email: 'abdul@gmail.com',
		nationalID: '4567890123',
		nationality: 'Saudi Arabia',
		countryFlag: 'https://flagcdn.com/sa.svg',
	},
	{
		id: 1086,
		created_at: '2026-09-05 00:42:41.465394+00',
		fullName: 'Julie Nguyen',
		email: 'julie@gmail.com',
		nationalID: '5678901234',
		nationality: 'Vietnam',
		countryFlag: 'https://flagcdn.com/vn.svg',
	},
	{
		id: 1087,
		created_at: '2026-09-05 00:42:41.465394+00',
		fullName: 'Sara Lee',
		email: 'sara@gmail.com',
		nationalID: '6789012345',
		nationality: 'South Korea',
		countryFlag: 'https://flagcdn.com/kr.svg',
	},
	{
		id: 1088,
		created_at: '2026-09-05 00:42:41.465394+00',
		fullName: 'Carlos Gomez',
		email: 'carlos@yahoo.com',
		nationalID: '7890123456',
		nationality: 'Colombia',
		countryFlag: 'https://flagcdn.com/co.svg',
	},
	{
		id: 1089,
		created_at: '2026-09-05 00:42:41.465394+00',
		fullName: 'Emma Brown',
		email: 'emma@gmail.com',
		nationalID: '8901234567',
		nationality: 'Canada',
		countryFlag: 'https://flagcdn.com/ca.svg',
	},
	{
		id: 1090,
		created_at: '2026-09-05 00:42:41.465394+00',
		fullName: 'Juan Hernandez',
		email: 'juan@yahoo.com',
		nationalID: '4343433333',
		nationality: 'Argentina',
		countryFlag: 'https://flagcdn.com/ar.svg',
	},
	{
		id: 1091,
		created_at: '2026-09-05 00:42:41.465394+00',
		fullName: 'Ibrahim Ahmed',
		email: 'ibrahim@yahoo.com',
		nationalID: '2345678009',
		nationality: 'Nigeria',
		countryFlag: 'https://flagcdn.com/ng.svg',
	},
	{
		id: 1092,
		created_at: '2026-09-05 00:42:41.465394+00',
		fullName: 'Mei Chen',
		email: 'mei@gmail.com',
		nationalID: '3456117890',
		nationality: 'Taiwan',
		countryFlag: 'https://flagcdn.com/tw.svg',
	},
];

export const putSampleGuests = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const guests = await guestsModel.insertMany(sampleGuests);

		res.status(201).json({
			ok: true,
			message: 'SUCCESS!',
			DATA: guests,
		});
	} catch (err: unknown) {
		const errMsg = err instanceof Error ? err.message : 'Something went wrong!';
		res.status(500).json({
			ok: false,
			message: errMsg,
		});
	}
};

export const deleteSampleGuests = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		await guestsModel.deleteMany();
		//
		res.status(200).json({
			ok: true,
			message: 'SAMPLES DELETED !!',
		});
	} catch (err: unknown) {
		const errMsg = err instanceof Error ? err.message : '';
		res.status(500).json({
			ok: false,
			message: errMsg,
		});
	}
};

/* ------ ------ The Main API ------ ------ */
export const getAllGuests = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const guests = await guestsModel.find();

		if (guests.length === 0) {
			res.status(404).json({
				ok: false,
				message: 'No guests found!!',
			});
			return;
		}

		res.status(200).json({
			ok: true,
			message: 'Retrieved guests successfully!',
			data: guests,
		});
	} catch (err: unknown) {
		const errMsg = err instanceof Error ? err.message : 'Something went wrong!';

		res.status(500).json({
			ok: false,
			message: errMsg,
		});
	}
};

export const getGuest = async (req: Request, res: Response): Promise<void> => {
	const guestId = req.params.guestId;
	try {
		const guestDoc = await guestsModel.findOne(
			{ _id: guestId },
			// { returnDocument: 'after' },
		);
		res.status(200).json({
			ok: true,
			message: 'Guest retrieved successfully!',
			data: guestDoc,
		});
	} catch (err: unknown) {
		const errMsg = err instanceof Error ? err.message : 'Something went wrong!';

		res.status(500).json({
			ok: true,
			message: errMsg,
		});
	}
};

export const createGuest = async (
	req: Request,
	res: Response,
): Promise<void> => {
	const newGuest = req.body;
	try {
		const newGuestDoc = await guestsModel.insertOne(newGuest);
		res.status(200).json({
			ok: true,
			message: 'Created guest successfully!',
			data: newGuestDoc,
		});
		//
	} catch (err: unknown) {
		const errMsg = err instanceof Error ? err.message : 'Something went wrong!';
		res.status(500).json({
			ok: false,
			message: errMsg,
		});
	}
};

export const editGuest = async (req: Request, res: Response): Promise<void> => {
	const guestId = req.params.guestId;
	const update = req.body;
	try {
		const guestDoc = await guestsModel.findOneAndUpdate(
			{ _id: guestId },
			update,
			{ returnDocument: 'after' },
		);

		if (!guestDoc) {
			res.status(404).json({
				ok: false,
				message: 'Guest Not Found !',
			});
			return;
		}

		res.status(200).json({
			ok: true,
			message: 'Guest edited successfully!',
			data: guestDoc,
		});
	} catch (err: unknown) {
		const errMsg = err instanceof Error ? err.message : 'Something went wrong!';
		res.status(500).json({
			ok: true,
			message: errMsg,
		});
	}
};

export const deleteGuest = async (
	req: Request,
	res: Response,
): Promise<void> => {
	const guestId = req.params.guestId;

	const guestDoc = await guestsModel.findOne({ _id: guestId });
	if (!guestDoc) {
		res.status(404).json({
			ok: false,
			message: 'Guest Not Found!',
		});
		return;
	}

	try {
		await guestsModel.findOneAndDelete({ _id: guestId });
		res.status(200).json({
			ok: true,
			message: 'Guest deleted successfully!',
		});
		// try
	} catch (err: unknown) {
		const errMsg = err instanceof Error ? err.message : 'Something went wrong!';
		res.status(500).json({
			ok: true,
			message: errMsg,
		});
	}
};
