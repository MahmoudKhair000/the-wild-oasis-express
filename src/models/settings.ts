import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
	_id: { type: String, default: 'settings' },
	minimumNights: { type: Number, required: true },
	maximumNights: { type: Number, required: true },
	maximumGuests: { type: Number, required: true },
	breakfastPrice: { type: Number, required: true },
});

settingsSchema.pre('validate', function () {
	if (this.isNew) this._id = 'settings';
});

const settingsModel = mongoose.model('settings', settingsSchema);

export { settingsModel };
