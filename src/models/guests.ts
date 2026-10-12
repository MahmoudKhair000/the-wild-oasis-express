import mongoose from 'mongoose';
import validator from 'validator';

const guestSchema = new mongoose.Schema({
	created_at: { type: Date, required: true, default: new Date() },
	updated_at: { type: Date },
	fullName: { type: String, required: true },
	email: {
		type: String,
		required: true,
		unique: true,
		validate: [validator.isEmail, 'Please provide a valid email'],
	},
	// gender: { type: String, enum: ['Male', 'Female'], required: true },
	nationalID: { type: String, unique: true },
	nationality: { type: String },
	countryFlag: { type: String },
});

const guestsModel = mongoose.model('guest', guestSchema);

export { guestsModel };
