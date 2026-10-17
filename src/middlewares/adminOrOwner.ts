import type { Request, Response, NextFunction } from 'express';
import type { AuthLocals } from './auth.ts';
import { usersModel } from '../models/users.ts';

export const adminOrOwner = async (
	req: Request,
	res: Response<unknown, AuthLocals>,
	next: NextFunction,
): Promise<void> => {
	/* ----- ----- ----- Initializing the userIds ----- ---- */
	const signedUserId: string = res.locals.userId;
	const paramsUserId = req.params.userId;
	/* Getting the user document and selecting the user role */
	const user = await usersModel.findById(signedUserId).select('_role');
	/* -------- Unauthorized, if there is no user ---- ----- */
	if (!user) {
		res.status(401).json({ error: 'Unauthorized' });
		return;
	}

	/* -- ----- Initializing owner and admin boolean ----- --*/
	const isOwner: boolean = signedUserId === paramsUserId;
	const isAdmin: boolean = user._role === 'admin';
	/* Forbidden, if the user isn't admin or owner of the operated user  */
	if (!isOwner && !isAdmin) {
		res.status(403).json({ error: 'Forbidden', cause: { isOwner, isAdmin } });
		return;
	}

	/* If there is no problems  */

	next();
};
