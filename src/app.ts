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

// Setting up CORS resolving
app.use(
	cors({
		origin: ['*'],
		// origin: ['http://localhost:3000'],
		// credentials: true,
	}),
);
app.use(express.json());

// Setting up mongodb connection
mongoose
	.connect(dbUrl)
	.then(() => {
		console.log('successfully connected to Mongo atlas!');
	})
	.catch((err: Error) => console.log(err.message));

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
