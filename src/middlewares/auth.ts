import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// console.log(match);
// let matchexample: RegExpMatchArray = [
// 	'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YWNkNTVhMTNkOTU4MmYzMTUwZTMzNjYiLCJpYXQiOjE3OTIwOTMxODEsImV4cCI6MTc5MjA5Njc4MX0.3t2FKJLfGqKL6FKgbO0zqrL_7QJbgonZeYOTtWyqppg',
// 	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YWNkNTVhMTNkOTU4MmYzMTUwZTMzNjYiLCJpYXQiOjE3OTIwOTMxODEsImV4cCI6MTc5MjA5Njc4MX0.3t2FKJLfGqKL6FKgbO0zqrL_7QJbgonZeYOTtWyqppg',
// 	'index: 0',
// 	'input: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YWNkNTVhMTNkOTU4MmYzMTUwZTMzNjYiLCJpYXQiOjE3OTIwOTMxODEsImV4cCI6MTc5MjA5Njc4MX0.3t2FKJLfGqKL6FKgbO0zqrL_7QJbgonZeYOTtWyqppg',
// 	'groups: undefined',
// ];

export interface AuthLocals {
	userId: string;
}
/**
 * Use `res.locals.userId` to allow or forbid user actions.
 *
 * @example
 * if (res.locals.userId !== req.params.userId) {
 *   res.status(401).json({ error: 'Unauthorized' });
 *   return;
 * }
 */
export function auth(
	req: Request,
	res: Response<unknown, AuthLocals>,
	// //Response<responseBody, responseLocals>
	next: NextFunction,
): void {
	/* Storing the .env JWT_SECRET */
	const secret = process.env.JWT_SECRET;
	if (!secret) {
		res.status(500).json({ error: 'Authentication is not configured' });
		return;
	}
	/* Storing the authorization from the request headers */
	// const match: RegExpMatchArray | null | undefined =,
	// You could just use split but matching is the better option
	const authorization = req.header('Authorization');
	const match = authorization?.match(/^Bearer\s+(\S+)$/i);
	if (!match) {
		res.status(401).json({ error: 'Unauthorized' });
		return;
	}
	/* Verifying the JWT with the .env JWT secret */
	try {
		const jwtPayload = jwt.verify(match[1], secret);
		if (
			typeof jwtPayload !== 'object'
			|| typeof jwtPayload.userId !== 'string'
		) {
			res.status(402).json({ error: 'Unauthorized' });
			return;
		}
		//  And this is the the secondary purpose of the function, which is
		//  storing a user ID if the Json web token payload checks out to be an object
		//  and the user ID to be a string
		res.locals.userId = jwtPayload.userId;
	} catch (error: unknown) {
		if (error instanceof jwt.JsonWebTokenError) {
			res.status(403).json({ error: 'Unauthorized' });
			return;
		}
		throw error;
	}
	/* The Main purpose of this function is not to go forward to the next route function if there is no Authentication, And if there is Authentication ? We would store a user ID at the response.locals */
	next();
}
