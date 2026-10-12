import mongoose from 'mongoose';

const cabinSchema = new mongoose.Schema({
	// _id:{type}
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now },
	name: { type: String, required: true },
	maxCapacity: { type: Number, required: true },
	regularPrice: { type: Number, required: true },
	discount: { type: Number, required: true },
	description: { type: String, required: true },
	image: { type: String, required: true },
});

const cabinsModel = mongoose.model('cabin', cabinSchema);

export { cabinsModel };
