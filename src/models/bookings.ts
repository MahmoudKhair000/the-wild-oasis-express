import mongoose, { Schema } from 'mongoose';

const bookingSchema = new Schema({
	created_at: { type: String, default: () => new Date().toISOString() },
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
	//
	isPaid: { type: Boolean, required: true },
	hasBreakfast: { type: Boolean, required: true },
	//
	observations: { type: String, required: true, default: '' },
});

bookingSchema.pre('save', function () {
	if (this.isNew) {
		// New bookings begin unpaid and unconfirmed; clients cannot choose these states.
		this.isPaid = false;
		this.hasBreakfast = false;
		this.status = 'unconfirmed';
	}

	// Keep the persisted total synchronized with its component prices.
	this.totalPrice = this.cabinPrice + this.extrasPrice;
});

const bookingModel = mongoose.model('booking', bookingSchema);

export { bookingModel };
