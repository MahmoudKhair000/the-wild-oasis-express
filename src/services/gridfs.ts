import mongoose from 'mongoose';

type MongoDatabase = NonNullable<typeof mongoose.connection.db>;

// Resolve the shared Mongoose connection before creating the GridFS bucket.
const database = new Promise<MongoDatabase>((resolve, reject) => {
	const resolveDatabase = () => {
		const connectedDatabase = mongoose.connection.db;

		if (connectedDatabase) {
			mongoose.connection.removeListener('connected', resolveDatabase);
			resolve(connectedDatabase);
		} else if (mongoose.connection.readyState === 1) {
			mongoose.connection.removeListener('connected', resolveDatabase);
			reject(new Error('Mongoose connected without a database handle'));
		}
	};

	if (mongoose.connection.readyState === 1) {
		resolveDatabase();
	} else {
		mongoose.connection.on('connected', resolveDatabase);
	}
});

export const getBucket = async () =>
	new mongoose.mongo.GridFSBucket(await database, {
		bucketName: 'cabinImages',
	});
