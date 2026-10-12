import type { Request, Response } from 'express';
import { settingsModel } from '../models/settings.ts';

const defaultSettings = {
	minimumNights: 2,
	maximumNights: 30,
	maximumGuests: 12,
	breakfastPrice: 15,
};

const settingsFilter = { _id: 'settings' } as any;

const getSettings = async (req: Request, res: Response): Promise<void> => {
	//
	try {
		// const settingsDoc = await settingsModel.findById('settings');
		const settingsDoc = await settingsModel.findOne(settingsFilter);
		// const settingsDoc = await settingsModel.findOneAndUpdate(
		// 	settingsFilter,
		// 	defaultSettings,
		// 	{ returnDocument: 'after', upsert: true, runValidators: true },
		// );

		res.status(200).json({
			ok: true,
			message: `Getting settings from '${req.protocol}://${req.get('host')}${req.originalUrl}' !`,
			data: settingsDoc,
		});
		//
	} catch (err: any) {
		res.status(500).json({ ok: false, message: err.message });
	}
	//
};

const editSettings = async (req: Request, res: Response): Promise<void> => {
	try {
		const settingsDoc = await settingsModel.findOneAndUpdate(
			settingsFilter,
			req.body,
			{ returnDocument: 'after', upsert: true, runValidators: true },
		);
		//
		res.status(200).json({
			ok: true,
			message: 'Settings has been edited successfully !',
			data: settingsDoc,
		});
		//
	} catch (err: any) {
		res.status(500).json({ ok: false, message: err.message });
	}
	//
};

const resetSettings = async (req: Request, res: Response): Promise<void> => {
	try {
		const oldSettings = await settingsModel.findOne(settingsFilter);

		const settingsDoc = await settingsModel.findOneAndReplace(
			settingsFilter,
			defaultSettings,
			{ returnDocument: 'after', upsert: true, runValidators: true },
		);
		//
		res.status(200).json({
			ok: true,
			message: 'Settings has been reset successfully !',
			oldData: oldSettings,
			data: settingsDoc,
		});
		//
	} catch (err: any) {
		res.status(500).json({ ok: false, message: err.message });
	}
};

export { editSettings, getSettings, resetSettings };
