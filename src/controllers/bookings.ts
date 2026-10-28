import { eachDayOfInterval, endOfDay } from 'date-fns';
import { format, isAfter, parseISO } from 'date-fns/fp';
import type { Request, Response } from 'express';
import { bookingsModel } from '../models/bookings.ts';
import { cabinsModel } from '../models/cabins.ts';
import { guestsModel } from '../models/guests.ts';

export const getAllBookings = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const bookings = await bookingsModel.find();
		//
		res.status(200).json({
			ok: true,
			message: 'bookings retreived successfully!',
			data: bookings,
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
		// You Logic goes here
		const booking = await bookingsModel.findById(paramsId);
		if (!booking) {
			res.status(404).json({ ok: false, message: 'Booking not found !' });
			return;
		}
		const cabins = await cabinsModel.findById(booking.cabinId);
		const guests = await guestsModel.findById(booking.guestId);
		if (!cabins) {
			res.status(404).json({ ok: false, message: 'cabin not found !' });
			return;
		}
		if (!guests) {
			res.status(404).json({ ok: false, message: 'guest not found !' });
			return;
		}
		//
		const bookingData = { ...booking.toObject(), cabins, guests };
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

		res
			.status(200)
			.json({
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
	//
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
