import { createHmac, timingSafeEqual } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import type { NextFunction, Request, Response } from 'express';
import swaggerSpec from '../config/swagger.ts';

const SESSION_COOKIE = 'api_docs_session';
const SESSION_DURATION = 8 * 60 * 60 * 1000;

const matchesSecret = (candidate: string, secret: string): boolean => {
	const candidateBuffer = Buffer.from(candidate);
	const secretBuffer = Buffer.from(secret);

	return (
		candidateBuffer.length === secretBuffer.length
		&& timingSafeEqual(candidateBuffer, secretBuffer)
	);
};

const createSessionToken = (timestamp: number, secret: string): string => {
	const signature = createHmac('sha256', secret)
		.update(String(timestamp))
		.digest('base64url');
	return `${timestamp}.${signature}`;
};

const hasValidSession = (req: Request, secret: string): boolean => {
	const cookie = req
		.header('Cookie')
		?.split(';')
		.map((part) => part.trim())
		.find((part) => part.startsWith(`${SESSION_COOKIE}=`))
		?.slice(SESSION_COOKIE.length + 1);
	if (!cookie) return false;

	const [timestampText, signature] = cookie.split('.');
	const timestamp = Number(timestampText);
	const now = Date.now();
	if (
		!Number.isSafeInteger(timestamp)
		|| timestamp > now
		|| now - timestamp >= SESSION_DURATION
		|| !signature
	) {
		return false;
	}

	const expectedSignature = createSessionToken(timestamp, secret).split('.')[1];
	return matchesSecret(signature, expectedSignature);
};

export const createSwaggerSession = (req: Request, res: Response): void => {
	res.setHeader('Cache-Control', 'no-store');
	const secret = process.env.API_DOCS_SECRET;
	if (!secret) {
		res.status(503).json({
			ok: false,
			message: 'API documentation access is not configured',
		});
		return;
	}

	const submittedSecret = req.body?.key;
	if (
		typeof submittedSecret !== 'string'
		|| !matchesSecret(submittedSecret, secret)
	) {
		res.status(401).json({ ok: false, message: 'Unauthorized' });
		return;
	}

	res.cookie(SESSION_COOKIE, createSessionToken(Date.now(), secret), {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		path: '/api-docs',
		maxAge: SESSION_DURATION,
	});
	res.status(204).end();
};

export const protectSwagger = (
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	const secret = process.env.API_DOCS_SECRET;
	if (!secret) {
		res.status(503).json({
			ok: false,
			message: 'API documentation access is not configured',
		});
		return;
	}

	if (hasValidSession(req, secret)) {
		next();
		return;
	}

	res.status(401).json({ ok: false, message: 'Unauthorized' });
};

export const serveSwaggerJson = (_req: Request, res: Response) => {
	res.json(swaggerSpec);
};

export const serveSwagger = (_req: Request, res: Response) => {
	res
		.type('html')
		.sendFile(fileURLToPath(new URL('../views/swagger.html', import.meta.url)));
};
