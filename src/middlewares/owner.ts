import type { Request, Response, NextFunction } from 'express';
import type { AuthLocals } from './auth.ts';
import { usersModel } from '../models/users.ts';

export const owner = async (
	req: Request,
	res: Response<unknown, AuthLocals>,
	next: NextFunction,
): Promise<void> => {
	/* Storing the value of authenticated user ID and the user ID in the parameters */
	const signedUserId: string = res.locals.userId;
	const paramsUserId = req.params.userId;
	/* fetching the user from the user's Model and storing the value, also storing the value of its owner which is based on if the user signed in ID equals to the params user ID */
	const user = await usersModel.findById(signedUserId);
	const isOwner: boolean = signedUserId === paramsUserId;
	/* and if there is no user document we will respond with a status code of 401 and JSON of error unauthorized */
	if (!user) {
		res.status(401).json({ error: 'Unauthorized' });
		return;
	}
	/* and if the user ID is not the owner of the account ? We will respond with a status code of 403 and with JSON of error forbidden */
	if (!isOwner) {
		res.status(403).json({ error: 'Forbidden' });
		return;
	}
	/* if there is no problems i.e. there is a user and it is an owner we will proceed to the next argument function */
	next();
};
