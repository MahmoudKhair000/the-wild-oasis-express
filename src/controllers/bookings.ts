import { eachDayOfInterval, endOfDay } from 'date-fns';
import { format, isAfter, parseISO } from 'date-fns/fp';
import type { Request, Response } from 'express';
import { bookingsModel } from '../models/bookings.ts';
import { cabinsModel } from '../models/cabins.ts';
import { guestsModel } from '../models/guests.ts';
import { settingsModel } from '../models/settings.ts';
import { getToday } from '../util/helpers.ts';

export const getAllBookings = async (
	req: Request,
	res: Response,
): Promise<void> => {
	const { filter, sortBy, page = 1, pageSize = 10 } = req.query;

	try {
		// const bookings = await bookingsModel.find();
		//
		const allowedSortFields = ['startDate', 'totalPrice'] as const;

		const sortParts =
			typeof sortBy === 'string' //
				? sortBy.split('-') //
				: [];
		const [field, order] = sortParts;
		const sortStage = //
			allowedSortFields.includes(field as (typeof allowedSortFields)[number]) //
				? {
						$sort: {
							[field]:
								order === 'desc' //
									? (-1 as const) //
									: (1 as const),
						},
					} //
				: undefined;

		// let paginatedBookings = sortedBookings;
		// if (page) {
		// }
		const bookingsWithDetails = await bookingsModel.aggregate([
			/* Filter and sort before the joins where possible. */
			...(filter && filter !== 'all' //
				? [{ $match: { status: filter } }] //
				: []),
			// We should only sort after filtering.
			...(sortStage ? [sortStage] : []),
			// We should only paginate after sorting.
			...[{ $skip: (Number(page) - 1) * Number(pageSize) }],
			...[{ $limit: Number(pageSize) }],
			// Then we can join the related collections
			// , to get the full details
			// , with less data transfer and computation power.
			{
				$lookup: {
					from: cabinsModel.collection.name,
					// from: 'cabins',
					localField: 'cabinId',
					foreignField: '_id',
					as: 'cabin',
				},
			},
			{
				$unwind: {
					path: '$cabin',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$lookup: {
					from: guestsModel.collection.name,
					localField: 'guestId',
					foreignField: '_id',
					as: 'guest',
				},
			},
			{
				$unwind: {
					path: '$guest',
					preserveNullAndEmptyArrays: true,
				},
			},
		]);
		//
		res.status(200).json({
			ok: true,
			message: 'bookings retreived successfully!',
			data: bookingsWithDetails,
		});
	} catch (err) {
		const errMsg = err instanceof Error ? err.message : 'Something Went Wrong!';
		//
		res.status(500).json({ ok: false, message: errMsg });
	}
};

export const getBooking = async (
	req: Request,
	res: Response,
): Promise<void> => {
	const paramsId = req.params.id;
	try {
		const booking = await bookingsModel.findById(paramsId);
		if (!booking) {
			res.status(404).json({ ok: false, message: 'Booking not found !' });
			return;
		}
		const cabin = await cabinsModel.findById(booking.cabinId);
		const guest = await guestsModel.findById(booking.guestId);
		if (!cabin) {
			res.status(404).json({ ok: false, message: 'cabin not found !' });
			return;
		}
		if (!guest) {
			res.status(404).json({ ok: false, message: 'guest not found !' });
			return;
		}
		//
		const bookingData = { ...booking.toObject(), cabin: cabin, guest: guest };
		//
		res.status(200).json({
			ok: true,
			message: 'booking retreived successfully!',
			data: bookingData,
		});
	} catch (err) {
		const errMsg =
			err instanceof Error
				? //
					err.message
				: //
					'Something Went Wrong!';
		//
		res.status(500).json({ ok: false, message: errMsg });
	}
};

export const createBooking = async (
	req: Request,
	res: Response,
): Promise<void> => {
	const newBooking = req.body;
	const { cabinId, guestId } = newBooking;
	//
	if (newBooking.isPaid !== undefined || newBooking.status !== undefined) {
		res.status(403).json({
			ok: false,
			message: 'Forbidden! You are not allowed to change this!',
		});
		return;
	}
	//
	const cabin = await cabinsModel.findById(cabinId);
	if (!cabin) {
		res.status(404).json({
			ok: false,
			message: 'Cabin not found!!',
		});
		return;
	}
	//
	const guest = await guestsModel.findById(guestId);
	if (!guest) {
		res.status(404).json({
			ok: false,
			message: 'Guest not found!!',
		});
		return;
	}
	//
	//
	try {
		const booking = await bookingsModel.create(newBooking);
		//
		res.status(200).json({
			ok: true,
			message: 'booking created successfully!',
			data: booking,
		});
	} catch (err) {
		const errMsg =
			err instanceof Error
				? //
					err.message
				: //
					'Something Went Wrong!';
		//
		res.status(500).json({ ok: false, message: errMsg });
	}
};

export const getCabinBookedDates = async (
	req: Request,
	res: Response,
): Promise<void> => {
	const { cabinId } = req.params;
	// const { startDate, endDate } = req.body;
	try {
		const bookings = await bookingsModel.find({ cabinId });
		//
		const isAfterToday = (dateStr: string) =>
			isAfter(endOfDay(new Date()))(parseISO(dateStr));
		// turning the date into formatted dateString
		const formatToDay = (date: Date) => format('yyyy-MM-dd')(date);
		//
		const dates = bookings
			.map((booking) =>
				eachDayOfInterval({
					start: parseISO(booking.startDate),
					end: parseISO(booking.endDate),
				}),
			)
			.flat()
			.map(formatToDay)
			.filter(isAfterToday);
		//
		res.status(200).json({
			ok: true,
			message: 'dates retreived successfully!',
			dates,
		});
		//
	} catch (err) {
		const errMsg =
			err instanceof Error
				? //
					err.message
				: //
					'Something Went Wrong!';
		//
		res.status(500).json({ ok: false, message: errMsg });
	}
};

export const getGuestBookings = async (
	req: Request,
	res: Response,
): Promise<void> => {
	const guestId = req.params.guestId;
	//
	try {
		const bookings = await bookingsModel.find({ guestId });

		res.status(200).json({
			ok: true,
			message: 'bookings retreived successfully!',
			data: bookings,
		});
	} catch (err) {
		const errMsg =
			err instanceof Error
				? //
					err.message
				: //
					'Something Went Wrong!';
		//
		res.status(500).json({ ok: false, message: errMsg });
	}
};

export const editBooking = async (
	req: Request,
	res: Response,
): Promise<void> => {
	//
	const paramsId = req.params.id;
	const update = req.body;
	//
	if (update.isPaid !== undefined || update.status !== undefined) {
		res.status(403).json({
			ok: false,
			message: 'Forbidden! You are not allowed to change this!',
		});
		return;
	}
	//
	try {
		const bookingDoc = await bookingsModel.findOneAndUpdate(
			{ _id: paramsId },
			update,
			{
				returnDocument: 'after',
				upsert: true,
				runValidators: true,
			},
		);
		//
		res.status(200).json({
			ok: true,
			message: 'Booking Edited Succssfully!',
			data: bookingDoc,
		});
	} catch (err) {
		const errMsg =
			err instanceof Error
				? //
					err.message
				: //
					'Something Went Wrong!';
		//
		res.status(500).json({ ok: false, message: errMsg });
	}
};

export const deleteBooking = async (
	req: Request,
	res: Response,
): Promise<void> => {
	const paramsId = req.params.id;
	try {
		const bookingDoc = await bookingsModel.findOneAndDelete({ _id: paramsId });
		//
		res.status(200).json({
			ok: true,
			message: 'Booking Deleted Succssfully!',
			data: bookingDoc,
		});
	} catch (err) {
		const errMsg =
			err instanceof Error
				? //
					err.message
				: //
					'Something Went Wrong!';
		//
		res.status(500).json({ ok: false, message: errMsg });
	}
};

export const confirmPaid = async (
	req: Request,
	res: Response,
): Promise<void> => {
	const paramsId = req.params.id;

	try {
		const bookingDoc = await bookingsModel.findOneAndUpdate(
			{ _id: paramsId },
			{ isPaid: true },
			{
				returnDocument: 'after',
				upsert: true,
				// runValidators: true,
			},
		);
		//
		res.status(200).json({
			ok: true,
			message: 'Payment Confirmed !',
			data: bookingDoc,
		});
	} catch (err) {
		const errMsg =
			err instanceof Error
				? //
					err.message
				: //
					'Something Went Wrong!';
		//
		res.status(500).json({ ok: false, message: errMsg });
	}
};

export const checkinBooking = async (
	req: Request,
	res: Response,
): Promise<void> => {
	const paramsId = req.params.id;
	const { addBreakfast } = req.body;
	const update: Partial<InstanceType<typeof bookingsModel>> = {
		status: 'checked-in',
	};
	//
	if (addBreakfast) {
		const booking = await bookingsModel.findById(paramsId);
		if (!booking) {
			res.status(404).json({ ok: false, message: 'Booking not found !' });
			return;
		}
		const settings = await settingsModel.findOne({ _id: 'settings' });
		if (!settings) {
			res.status(404).json({ ok: false, message: 'Settings not found !' });
			return;
		}
		//
		const { numGuests, numNights, cabinPrice } = booking;
		const { breakfastPrice } = settings;
		const newExtrasPrice = breakfastPrice * numNights * numGuests;
		//
		update.hasBreakfast = true;
		update.extrasPrice = newExtrasPrice;
		update.totalPrice = cabinPrice + newExtrasPrice;
	}

	try {
		const bookingDoc = await bookingsModel.findOneAndUpdate(
			{ _id: paramsId },
			update,
			{
				returnDocument: 'after',
				upsert: true,
				// runValidators: true,
			},
		);
		//
		res.status(200).json({
			ok: true,
			message: `Booking Checked-in Succssfully !${
				addBreakfast //
					? ', and Breakfast added!'
					: ''
			}`,
			data: bookingDoc,
		});
	} catch (err) {
		const errMsg =
			err instanceof Error
				? //
					err.message
				: //
					'Something Went Wrong!';
		//
		res.status(500).json({ ok: false, message: errMsg });
	}
};

export const checkoutBooking = async (
	req: Request,
	res: Response,
): Promise<void> => {
	const paramsId = req.params.id;
	const update: Partial<InstanceType<typeof bookingsModel>> = {
		status: 'checked-out',
	};

	try {
		const bookingDoc = await bookingsModel.findOneAndUpdate(
			{ _id: paramsId },
			update,
			{
				returnDocument: 'after',
				upsert: true,
				// runValidators: true,
			},
		);
		//
		res.status(200).json({
			ok: true,
			message: 'Payment Confirmed !',
			data: bookingDoc,
		});
	} catch (err) {
		const errMsg =
			err instanceof Error
				? //
					err.message
				: //
					'Something Went Wrong!';
		//
		res.status(500).json({ ok: false, message: errMsg });
	}
};

export const getTodayActivity = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const bookingsData = await bookingsModel.aggregate([
			...[
				{ $match: { startDate: { $eq: format('yyyy-MM-dd')(new Date()) } } },
				{ $match: { status: { $ne: 'checked-out' } } },
			],
		]);
		//
		res.status(200).json({
			ok: true,
			message: 'booking retreived successfully!',
			startDate: format('yyyy-MM-dd')(new Date()),
			data: bookingsData,
		});
	} catch (err) {
		const errMsg =
			err instanceof Error
				? //
					err.message
				: //
					'Something Went Wrong!';
		//
		res.status(500).json({ ok: false, message: errMsg });
	}
};

export const getBookingsAfterDate = async (
	req: Request,
	res: Response,
): Promise<void> => {
	const paramDate = req.params.date;
	const startDate = new Date(`${paramDate}T00:00:00.000Z`);

	if (
		!/^\d{4}-\d{2}-\d{2}$/.test(paramDate as string)
		|| Number.isNaN(startDate.getTime())
		|| startDate.toISOString().slice(0, 10) !== paramDate
	) {
		res.status(400).json({ ok: false, message: 'Invalid date parameter!' });
		return;
	}

	try {
		const bookingsData = await bookingsModel.find({
			created_at: {
				$gte: startDate.toISOString(),
				$lte: getToday({ end: true }),
			},
		});
		///
		res.status(200).json({
			ok: true,
			message: 'booking retreived successfully!',
			startDate: format('yyyy-MM-dd')(new Date()),
			data: bookingsData,
		});
	} catch (err) {
		const errMsg =
			err instanceof Error
				? //
					err.message
				: //
					'Something Went Wrong!';
		//
		res.status(500).json({ ok: false, message: errMsg });
	}
};

export const getStaysAfterDate = async (
	req: Request,
	res: Response,
): Promise<void> => {
	const paramDate = req.params.date;
	const startDate = new Date(`${paramDate}T00:00:00.000Z`);

	if (
		!/^\d{4}-\d{2}-\d{2}$/.test(paramDate as string)
		|| Number.isNaN(startDate.getTime())
		|| startDate.toISOString().slice(0, 10) !== paramDate
	) {
		res.status(400).json({ ok: false, message: 'Invalid date parameter!' });
		return;
	}

	try {
		const staysData = await bookingsModel.find({
			startDate: {
				$gt: format('yyyy-MM-dd')(new Date(paramDate as string)),
				$lte: format('yyyy-MM-dd')(getToday({ end: true })),
			},
			//
		});
		///
		res.status(200).json({
			ok: true,
			message: 'booking retreived successfully!',
			startDate: format('yyyy-MM-dd')(new Date()),
			data: staysData,
		});
	} catch (err) {
		const errMsg =
			err instanceof Error
				? //
					err.message
				: //
					'Something Went Wrong!';
		//
		res.status(500).json({ ok: false, message: errMsg });
	}
};
