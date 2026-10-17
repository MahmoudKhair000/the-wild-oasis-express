import type { NextFunction, Request, Response } from 'express';
import { usersModel } from '../models/users.ts';

interface AuthLocals {
	userId: string;
}

export async function admin(
	_req: Request,
	res: Response<unknown, AuthLocals>,
	next: NextFunction,
): Promise<void> {
	const signedUserId = res.locals.userId;
	/* Getting the user document from the user's Model and selecting one property from the whole object which is '_role'  */
	const user = await usersModel.findById(signedUserId).select('_role');
	/* If there is not a user ? I.E. if we failed to fetch the user document we will respond with a 401 code, and JSON of error: 'unauthorized' */
	if (!user) {
		res.status(401).json({ error: 'Unauthorized' });
		return;
	}
	/* After fiction I use the document we will check if its role is an admin and if not ? We will respond with the status code of 403 and a JSON {error: 'forbidden}' */
	if (user._role !== 'admin') {
		res.status(403).json({ error: 'Forbidden' });
		return;
	}
	/* If there is a user and it role is an admin proceed to the next argument function  */
	next();
}
