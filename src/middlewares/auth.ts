import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface AuthLocals {
	userId: string;
}

export function auth(
	req: Request,
	res: Response<unknown, AuthLocals>,// Response<responseBody, responseLocals>
	next: NextFunction,
): void {
	const secret = process.env.JWT_SECRET;
	if (!secret) {
		res.status(500).json({ error: 'Authentication is not configured' });
		return;
	}

	const authorization = req.header('Authorization');
	const match = authorization?.match(/^Bearer\s+(\S+)$/i);
	if (!match) {
		res.status(401).json({ error: 'Unauthorized' });
		return;
	}

	try {
		const payload = jwt.verify(match[1], secret);
		if (typeof payload !== 'object' || typeof payload.userId !== 'string') {
			res.status(401).json({ error: 'Unauthorized' });
			return;
		}
		res.locals.userId = payload.userId;
	} catch (error: unknown) {
		if (error instanceof jwt.JsonWebTokenError) {
			res.status(401).json({ error: 'Unauthorized' });
			return;
		}
		throw error;
	}

	next();
}

