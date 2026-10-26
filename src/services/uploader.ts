import type { StorageEngine } from 'multer';
import { getBucket } from './gridfs.ts';
import multer from 'multer';

const GridFsStorage: StorageEngine = {
	async _handleFile(req, file, callback) {
		const filename = `${Date.now()}-${file.originalname}`;
		const uploadStream = (await getBucket()).openUploadStream(filename, {
			metadata: {
				contentType: file.mimetype,
				uploadedBy: req.res?.locals.userId,
			},
		});

		// Notify Multer only after GridFS has finished storing the stream.
		file.stream
			.pipe(uploadStream)
			.on('error', callback)
			.on('finish', () =>
				callback(null, {
					id: uploadStream.id,
					filename,
					size: uploadStream.length,
				} as Partial<Express.Multer.File>),
			);
	},
	async _removeFile(_req, file, callback) {
		// Multer calls this if a later middleware rejects an already-uploaded file.
		(await getBucket())
			.delete((file as any).id)
			.then(() => callback(null), callback);
	},
};

export const uploadImage = multer({
	storage: GridFsStorage,
	limits: { fileSize: 2 * 1024 * 1024, files: 1 },
	fileFilter: (_req, file, cb) =>
		file.mimetype.startsWith('image/')
			? cb(null, true)
			: cb(new Error('Only image files are allowed')),
}).single('image');
