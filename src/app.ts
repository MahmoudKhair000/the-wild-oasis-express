// importing the required modules
import cors from 'cors';
import 'dotenv/config';
import express, { type Express } from 'express';
import mongoose from 'mongoose';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// importing the main routers
import { router as bookingsRouter } from './routes/bookings.ts';
import { router as cabinsRouter } from './routes/cabins.ts';
import { router as guestsRouter } from './routes/guests.ts';
import { router as settingsRouter } from './routes/settings.ts';
import {
	createSwaggerSession,
	protectSwagger,
	serveSwagger,
	serveSwaggerJson,
} from './routes/swagger.ts';
import { router as usersRouter } from './routes/users.ts';

const app: Express = express();

// Setting up mongodb connection directly
/*
	mongoose
		.connect(dbUrl)
		.then(() => {
			console.log('successfully connected to Mongo atlas!');
		})
		.catch((err: Error) => console.log(err.message));
*/

const dbUrl = process.env.MONGODB_URI;
if (!dbUrl) {
	throw new Error('MONGODB_URI environment variable is required');
}

// Setting up mongodb connection with a promise to avoid multiple connections
let dbConnection: Promise<void> | null = null;
const connectToDatabase = () => {
	if (mongoose.connection.readyState === 1) return Promise.resolve();
	if (!dbConnection) {
		dbConnection = mongoose
			.connect(dbUrl)
			.then(() => {
				console.log('successfully connected to Mongo atlas!');
			})
			.catch((err: Error) => {
				dbConnection = null;
				throw err;
			});
	}
	return dbConnection;
};

// Setting up CORS resolving
app.use(
	cors({
		origin: '*',
		// origin: ['http://localhost:3000'],
		methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		// credentials: true,
	}),
);

// Setting up express request handling
app.use(express.json());

// Setting up Swagger documentation routes
app.post('/api-docs/session', createSwaggerSession);
app.get('/api-docs/openapi.json', protectSwagger, serveSwaggerJson);
app.get(['/api-docs', '/api-docs/'], serveSwagger);

// Setting up mongoose connection
app.use(async (_req, res, next) => {
	try {
		await connectToDatabase();
		next();
	} catch (err) {
		console.error('MongoDB connection failed:', err);
		res.status(503).json({ ok: false, message: 'Database unavailable' });
	}
});

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set(
	'views',
	path.join(path.dirname(fileURLToPath(import.meta.url)), 'views'),
);

// Assigning routes to main routes
// , after handling the db connection and setting up views
app.use('/users/', usersRouter);
app.use('/guests/', guestsRouter);
app.use('/cabins/', cabinsRouter);
app.use('/settings/', settingsRouter);
app.use('/bookings/', bookingsRouter);

// Exporting the app for server and serverless functions (Vercel)
export default app;
