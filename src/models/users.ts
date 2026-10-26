import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	email: {
		type: String,
		required: true,
		validate: [validator.isEmail, 'Please provide a valid email'],
		unique: true,
	},
	password: { type: String, required: true },
	imageUrl: { type: String, default: '' },
	//
	_verified: { type: Boolean },
	_role: { type: String, enum: ['admin', 'user'], default: 'user' },
});

// type UserDocument = mongoose.Document & {
// 	_role: 'admin' | 'user';
// 	firstName: string;
// 	lastName: string;
// 	email: string;
// 	password: string;
// };

userSchema.pre('save', function () {
	if (this.isNew) {
		this._verified = false;
		this._role = 'user';
	}

	if (this.password) {
		const salt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync(this.password, salt);
		this.password = hash;
	}
});

const usersModel = mongoose.model('user', userSchema);

export { usersModel };
