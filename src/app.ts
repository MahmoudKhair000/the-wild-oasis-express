import cors from 'cors';
import 'dotenv/config';
import express, { type Express } from 'express';
import mongoose from 'mongoose';
import { router as bookingsRouter } from './routes/bookings.ts';
import { router as cabinsRouter } from './routes/cabins.ts';
import { router as guestsRouter } from './routes/guests.ts';
import { router as settingsRouter } from './routes/settings.ts';
import { router as usersRouter } from './routes/users.ts';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app: Express = express();
const dbUrl = process.env.MONGODB_URI;

if (!dbUrl) {
	throw new Error('MONGODB_URI environment variable is required');
}

// // Setting up mongodb connection directly
// mongoose
// 	.connect(dbUrl)
// 	.then(() => {
// 		console.log('successfully connected to Mongo atlas!');
// 	})
// 	.catch((err: Error) => console.log(err.message));

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
		origin: ['*'],
		// origin: ['http://localhost:3000'],
		// credentials: true,
	}),
);
app.use(express.json());

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
app.use('/users/', usersRouter);
app.use('/guests/', guestsRouter);
app.use('/cabins/', cabinsRouter);
app.use('/settings/', settingsRouter);
app.use('/bookings/', bookingsRouter);

export default app;
