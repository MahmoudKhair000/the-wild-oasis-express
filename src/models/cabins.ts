import mongoose from 'mongoose';

const cabinSchema = new mongoose.Schema({
	// _id:{type}
	created_at: { type: String, default: () => new Date().toISOString() },
	updated_at: { type: String, default: () => new Date().toISOString() },
	name: { type: String, required: true },
	maxCapacity: { type: Number, required: true },
	regularPrice: { type: Number, required: true },
	discount: { type: Number, required: true },
	description: { type: String, required: true },
	image: { type: String, required: true },
});

cabinSchema.pre('save', function () {
	if (!this.isNew) {
		this.updated_at = new Date().toISOString();
	}
});

const cabinsModel = mongoose.model('cabin', cabinSchema);

export { cabinsModel };
