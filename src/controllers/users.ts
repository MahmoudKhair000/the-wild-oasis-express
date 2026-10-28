import bcrypt from 'bcryptjs';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { usersModel } from '../models/users.ts';
import transporter from '../services/nodeMailer.ts';
import { mailHTML, passwordUpdateHTML } from '../views/htmlTemplates.ts';

/* Getting Users */
export const getAllUsers = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const users = await usersModel.find();
		res.status(200).json({
			ok: true,
			message: `Users retrieved successfully`,
			data: users,
		});
	} catch (err: unknown) {
		const errMsg = err instanceof Error ? err.message : 'Something went wrong!';
		res.status(500).json({
			ok: false,
			message: errMsg,
		});
	}
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
	const userId = req.params.userId;

	try {
		const user = await usersModel.findOne({ _id: userId });
		res.status(200).json({
			ok: true,
			message: `User:${userId} retrieved successfully`,
			data: user,
		});
	} catch (err: unknown) {
		const errMsg = err instanceof Error ? err.message : 'Something went wrong!';
		res.status(500).json({
			ok: false,
			message: errMsg,
		});
	}
};
/* Create User & Login */
export const createUser = async (
	req: Request,
	res: Response,
): Promise<void> => {
	const newUser = req.body;

	const existingUser = await usersModel.findOne({ email: newUser.email });
	if (existingUser && existingUser._verified) {
		res.status(500).json({
			ok: false,
			message: 'There is already a user assigned to that mail',
		});
		return;
	}
	if (existingUser && !existingUser._verified) {
		await usersModel.findOneAndDelete({ email: newUser.email });
	}

	try {
		/* | | | | | */
		const userDoc = await usersModel.create(newUser);
		/* | | | | | */
		const vtoken = jwt.sign(
			{ email: req.body.email },
			process.env.JWT_SECRET!,
			{ expiresIn: '45mins' },
		);
		let emailSent = false;
		const activationLink = `${
			process.env.APP_HOST
				? process.env.APP_HOST
				: `${req.protocol}://${req.host}`
		}/users/confirm-email/${vtoken}`;
		//
		try {
			const info = await transporter.sendMail({
				from: process.env.SMTP_USER,
				to: req.body.email,
				subject: 'Confirmation Mail',
				text: `Hello from The Wild Oasis! Click the link to activate your account`,
				html: mailHTML(activationLink),
			});

			emailSent = info.accepted.length > 0 && info.rejected.length === 0;

			if (emailSent) {
				console.log('SMTP accepted signup email:', info.response);
			} else {
				console.error('SMTP did not accept signup email:', {
					response: info.response,
					acceptedRecipients: info.accepted.length,
					rejectedRecipients: info.rejected.length,
				});
				return;
			}
		} catch (err: unknown) {
			console.error('Failed to send signup email:', err);
		}
		/* | | | | | */
		res.status(201).json({
			ok: true,
			message:
				'User created; the mail server accepted the email. Check spam or junk if it is missing.',
			// lastName: userDoc.lastName,
			userDoc: {
				_id: userDoc._id,
				fullName: `${userDoc.firstName} ${userDoc.lastName}`,
				email: userDoc.email,
				role: userDoc._role,
			},
		});
		/* | | | | | */
	} catch (err: unknown) {
		const errMsg = err instanceof Error ? err.message : 'Something went wrong!';
		res.status(500).json({
			ok: false,
			message: errMsg,
		});
	}
};

export const confirmEmail = async (
	req: Request,
	res: Response,
): Promise<void> => {
	// The jwt token has the email and crypto code
	const JWT_SECRET = process.env.JWT_SECRET;
	const vtoken = req.params.token as string;
	//
	if (!JWT_SECRET) {
		res.status(500).json({
			ok: false,
			message: 'JWT SECRET is not configured',
		});
		return;
	}
	const jwtPayload = jwt.verify(vtoken, JWT_SECRET);
	if (typeof jwtPayload !== 'object' || typeof jwtPayload.email !== 'string') {
		res.status(500).json({
			ok: false,
			message: 'There is no JWT Payload!',
		});
		return;
	}
	//
	try {
		//|
		const userDoc = await usersModel.findOneAndUpdate(
			{ email: jwtPayload.email },
			{ _verified: true },
			{ returnDocument: 'after', upsert: true, runValidators: true },
		);
		if (!userDoc) return;
		//
		// res.status(200).json({
		// 	ok: true,
		// 	message: `Verification token is ${vtoken}`,
		// 	jwtPayload,
		// 	userDoc,
		// });
		//
		res.status(200).render('activated', {
			title: 'Account activated',
			username: `${userDoc.firstName} ${userDoc.lastName}`,
		});
		//|
	} catch (err: unknown) {
		const errMsg = err instanceof Error ? err.message : 'Something went wrong!';
		res.status(500).json({
			ok: false,
			message: errMsg,
			jwtPayload,
		});
	}
};
// let testAdmin = {
// 	firstName: 'Mahmoud',
// 	lastName: 'Khair',
// 	email: 'mahmoud4test@example.com',
// 	password: 'pass4test',
// };

// let testUser = {
// 	firstName: 'example',
// 	lastName: 'user',
// 	email: 'example4test@example.com',
// 	password: '2ndpass4test4user',
// };

export const logInUser = async (req: Request, res: Response): Promise<void> => {
	const credentials = req.body;
	const { email, password } = credentials;

	if (!email || !password) {
		res.status(400).json({
			ok: false,
			message: 'Enter email and password !!',
		});
		return;
	}

	const jwtSecret = process.env.JWT_SECRET;
	if (!jwtSecret) {
		res.status(500).json({
			ok: false,
			message: 'Authentication is not configured',
		});
		return;
	}

	try {
		const user = await usersModel.findOne({ email }).select('+password');
		if (!user) {
			res.status(404).json({
				ok: false,
				message: "There' no user assigned to that email",
			});
			return;
		}
		//
		if (!user._verified) {
			res.status(404).json({
				ok: false,
				message: 'You need to verify your email before you sign in',
			});
			return;
		}
		//
		const isValid = await bcrypt.compare(password, user.password);
		if (isValid) {
			const token = jwt.sign(
				// This is the jwtPayload that will resolve of jwt.verify(token, jwtSecret)
				{ userId: user._id, email: user.email },
				// And this is the environment variable of JWT_SECRET
				jwtSecret,
				// Sign options of the token, expiration, algorithm, etc. At least expiresIn
				// { expiresIn: '1h' },
				{ expiresIn: '3hours' },
			);

			res.status(200).json({
				ok: true,
				message: 'Successfully Logged In !',
				token,
				user: {
					_id: user._id,
					firstName: user.firstName,
					lastName: user.lastName,
					email: user.email,
					role: user._role,
				},
			});
		} else {
			res.status(401).json({
				ok: false,
				message: 'Wrong password !',
			});
			return;
		}
	} catch (err: unknown) {
		const errMsg = err instanceof Error ? err.message : 'Something went wrong!';
		res.status(500).json({
			ok: false,
			message: errMsg,
		});
	}
};

/* Edit & Delete User */
export const editUser = async (req: Request, res: Response): Promise<void> => {
	const update = req.body;
	const paramsUserId = req.params.userId;

	if (
		['email', 'password', '_role', '_verified', '_id', '_v'].some((property) =>
			Object.hasOwn(update, property),
		)
	) {
		res.status(403).json({
			ok: false,
			message:
				'Password, email, verefied, and role cannot be changed through this endpoint.',
		});
		return;
	}

	try {
		const user = await usersModel.findByIdAndUpdate(paramsUserId, update, {
			returnDocument: 'after',
			upsert: true,
			runValidators: true,
		});
		res.status(200).json({
			ok: true,
			message: 'User was edited successfully!',
			user: {
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				_role: user._role,
			},
		});
	} catch (err: unknown) {
		const errMsg = err instanceof Error ? err.message : 'Something went wrong!';
		res.status(500).json({
			ok: false,
			message: errMsg,
		});
	}
};

export const deleteUser = async (
	req: Request,
	res: Response,
): Promise<void> => {
	const paramsUserId = req.params.userId;

	const userDoc = await usersModel.findById(paramsUserId);
	if (!userDoc) {
		res.status(404).json({
			ok: false,
			message: 'User was not found !!',
		});
		return;
	}

	try {
		const deletedDoc = await usersModel.findByIdAndDelete(paramsUserId, {
			returnDocument: 'before',
		});

		res.status(200).json({
			ok: true,
			message: 'user was deleted successfully!',
			deleted: deletedDoc,
		});
	} catch (err: unknown) {
		const errMsg = err instanceof Error ? err.message : 'Something went wrong!';
		res.status(500).json({ ok: false, message: errMsg });
	}
};

/* Update User's Password */
export const updatePasswordRequest = async (
	req: Request,
	res: Response,
): Promise<void> => {
	//
	const JWT_SECRET = process.env.JWT_SECRET;
	const paramsUserId = req.params.userId;
	// const bodyPassword = req.body.password;
	//
	const existingUser = await usersModel.findById(paramsUserId);
	//
	if (!JWT_SECRET) {
		res.status(401).json({
			ok: false,
			message: 'The JWT Secret is not set up!',
		});
		return;
	}
	//
	if (!existingUser) {
		res.status(404).json({
			ok: false,
			message: "That user doesn't exist!",
		});
		return;
	}
	//
	// let emailSent = false;
	// creating the token with the Id
	const vtoken = jwt.sign(
		{
			userId: existingUser._id,
			// email: existingUser.email,
			// password: bodyPassword,
		},
		JWT_SECRET,
		{ expiresIn: '1hr' },
	);
	//
	try {
		/*
		const info = await transporter.sendMail({
			from: process.env.SMTP_USER,
			to: existingUser.email,
			subject: 'Password Update Mail',
			text: `Hello from The Wild Oasis! Click the link to confirm your new password`,
			html: passwordUpdateHTML(vtoken),
		});

		emailSent = info.accepted.length > 0 && info.rejected.length === 0;

		if (emailSent) {
			console.log('SMTP accepted signup email:', info.response);
		} else {
			console.error('SMTP did not accept signup email:', {
				response: info.response,
				acceptedRecipients: info.accepted.length,
				rejectedRecipients: info.rejected.length,
			});
			return;
		}
		*/
		res.status(200).json({
			ok: true,
			message: 'Your password update request was accepted! ↓',
			token: vtoken,
		});
		//
	} catch (err: unknown) {
		const errMsg =
			err instanceof Error ? err.message : 'Something Went Wrong!!';
		res.status(500).json({
			ok: false,
			message: errMsg,
		});
	}
};

/* This functionality should change when we make the CMS frontend */
export const updatePassword = async (
	req: Request,
	res: Response,
	// next: NextFunction,
): Promise<void> => {
	/* ---------------------------------------------------- */
	const JWT_SECRET = process.env.JWT_SECRET;
	const paramsToken = req.params.token;
	const bodyPassword = req.body.password;
	if (!JWT_SECRET) {
		res.status(401).json({
			ok: false,
			message: 'Authentication is not configured',
		});
		return;
	}
	if (!paramsToken || typeof paramsToken !== 'string') {
		res.status(401).json({
			ok: false,
			message: 'Token could not be found!',
		});
		return;
	}
	//
	const jwtPayload = jwt.verify(paramsToken, JWT_SECRET);
	if (!jwtPayload) {
		res.status(401).json({
			ok: false,
			message: 'JWT payload could not be found',
		});
		return;
	}
	if (typeof jwtPayload !== 'object' || typeof jwtPayload.userId !== 'string') {
		res.status(401).json({
			ok: false,
			message: 'userId could not be found !',
		});
		return;
	}
	const { userId } = jwtPayload;
	// Hashing the password to change
	const salt = await bcrypt.genSalt(10);
	const hashPass = await bcrypt.hash(bodyPassword, salt);
	//
	try {
		//
		const userDoc = await usersModel.findByIdAndUpdate(
			userId,
			{ password: hashPass },
			{ returnDocument: 'after', upsert: true, runValidators: true },
		);

		res.status(200).json({
			ok: true,
			message: 'Password Updated Successfully!',
			user: {
				firstName: userDoc.firstName,
				lastName: userDoc.lastName,
			},
		});
		//
	} catch (err: unknown) {
		const errMessage =
			err instanceof Error ? err.message : 'Something Went Wrong!';

		res.status(500).json({
			ok: false,
			message: errMessage,
		});
	}
};

/* Make Admin */
// const authUserId = res.locals.userId;

export const makeAdmin = async (req: Request, res: Response): Promise<void> => {
	const userIdParam = req.params.userId;

	const user = await usersModel.findById(userIdParam);
	if (!user) {
		res.status(404).json({
			ok: false,
			message: `Could not find user with id:${userIdParam} !`,
		});
		return;
	}

	try {
		const userDoc = await usersModel.findOneAndUpdate(
			{ _id: userIdParam },
			{ _role: 'admin' },
			{ returnDocument: 'after', upsert: true, runValidators: true },
		);

		res.status(200).json({
			ok: true,
			message: 'User has been promoted to admin',
			user: {
				firstName: userDoc.firstName,
				lastName: userDoc.lastName,
				email: userDoc.email,
				_role: userDoc._role,
			},
		});
	} catch (err: unknown) {
		const errMsg = err instanceof Error ? err.message : 'Something went wrong!';
		res.status(500).json({
			ok: false,
			message: errMsg,
		});
	}
};

export const makeUser = async (req: Request, res: Response): Promise<void> => {
	const userIdParam = req.params.userId;

	const user = await usersModel.findById(userIdParam);
	if (!user) {
		res.status(404).json({
			ok: false,
			message: "Couldn't find User !!",
		});
		return;
	}

	if (res.locals.userId == userIdParam) {
		res.status(402).json({
			ok: true,
			message: 'Dude! You cannot demote yourself!',
		});
		return;
	}

	try {
		const userDoc = await usersModel.findOneAndUpdate(
			{ _id: userIdParam },
			{ _role: 'user' },
			{ returnDocument: 'after', upsert: true, runValidators: true },
		);

		res.status(200).json({
			ok: true,
			message: 'User has been demoted from admin',
			user: {
				firstName: userDoc.firstName,
				lastName: userDoc.lastName,
				email: userDoc.email,
				_role: userDoc._role,
			},
		});
	} catch (err: unknown) {
		const errMsg = err instanceof Error ? err.message : 'Something went wrong!';
		res.status(500).json({
			ok: false,
			message: errMsg,
		});
	}
};
