import mongoose, { Schema } from 'mongoose';

const bookingSchema = new Schema({
	created_at: { type: String, default: () => new Date().toISOString() },
	updated_at: { type: String, default: () => new Date().toISOString() },
	//
	cabinId: { type: mongoose.Types.ObjectId, required: true },
	guestId: { type: mongoose.Types.ObjectId, required: true },
	//
	startDate: { type: String, required: true },
	endDate: { type: String, required: true },
	//
	numGuests: { type: Number, required: true },
	numNights: { type: Number, required: true },
	//
	cabinPrice: { type: Number, required: true },
	extrasPrice: { type: Number, required: true },
	totalPrice: { type: Number, required: true },
	//
	status: {
		type: String,
		enum: ['unconfirmed', 'checked-in', 'checked-out'],
		default: 'unconfirmed',
	},
	isPaid: { type: Boolean },
	//
	hasBreakfast: { type: Boolean, required: true },
	//
	observations: { type: String, required: true, default: '' },
});

bookingSchema.pre('save', function () {
	if (this.isNew) {
		// New bookings begin unpaid and unconfirmed; clients cannot choose these states.
		this.isPaid = false;
		this.status = 'unconfirmed';
	}
	if (!this.isNew) this.updated_at = new Date().toISOString();

	// Keep the persisted total synchronized with its component prices.
	this.totalPrice = this.cabinPrice + this.extrasPrice;
});

bookingSchema.pre(['updateOne', 'findOneAndUpdate'], function () {
	this.set({ updated_at: new Date().toISOString() });
});

const bookingsModel = mongoose.model('booking', bookingSchema);

export { bookingsModel };
