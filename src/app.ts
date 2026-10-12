import { configDotenv } from 'dotenv';
import express, { type Express } from 'express';
import mongoose from 'mongoose';
import { router as cabinsRouter } from './routes/cabins.ts';
import { router as bookingsRouter } from './routes/bookings.ts';
import { router as settingsRouter } from './routes/settings.ts';
import cors from 'cors';

const app: Express = express();
configDotenv();
const dbUrl = process.env.MONGODB_URI;

if (!dbUrl) {
	throw new Error('MONGODB_URI environment variable is required');
}

let connectionPromise: Promise<typeof mongoose> | undefined;

const connectToDatabase = () => {
	if (mongoose.connection.readyState === 1) {
		return Promise.resolve(mongoose);
	}

	if (mongoose.connection.readyState === 2) {
		return mongoose.connection.asPromise();
	}

	if (!connectionPromise) {
		connectionPromise = mongoose.connect(dbUrl).finally(() => {
			connectionPromise = undefined;
		});
	}

	return connectionPromise;
};

app.use(
	cors({
		origin: ['*'],
		// origin: ['http://localhost:3000'],
		credentials: true,
	}),
);
app.use(express.json());

app.use(async (_req, _res, next) => {
	try {
		await connectToDatabase();
		next();
	} catch (error) {
		console.error('MongoDB connection failed:', error);
		next(error);
	}
});

// app.use('/guests/', guestsRouter);
app.use('/cabins/', cabinsRouter);
app.use('/settings/', settingsRouter);
app.use('/bookings/', bookingsRouter);

export default app;
