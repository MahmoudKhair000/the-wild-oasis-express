import { configDotenv } from 'dotenv';
import express, { type Express } from 'express';
import mongoose from 'mongoose';
import { router as cabinsRouter } from './routes/cabins.ts';
import { router as bookingsRouter } from './routes/bookings.ts';
import { router as settingsRouter } from './routes/settings.ts';
import cors from 'cors';

const app: Express = express();
const port = 4000;
configDotenv();
const dbUrl = process.env.MONGODB_URI as string;

app.use(
	cors({
		origin: ['*'],
		// origin: ['http://localhost:3000'],
		credentials: true,
	}),
);
app.use(express.json());

mongoose
	.connect(dbUrl)
	.then(() => {
		console.log('successfully connected to Mongo atlas!');
	})
	.catch((err: Error) => console.log(err.message));

// app.use('/guests/', guestsRouter);
app.use('/cabins/', cabinsRouter);
app.use('/settings/', settingsRouter);
app.use('/bookings/', bookingsRouter);

app.listen(port, () => {
	console.log(`Backend is listening on port ${port}`);
});

export default app;
