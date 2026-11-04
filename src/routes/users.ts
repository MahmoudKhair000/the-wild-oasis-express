import express, { type Router } from 'express';
import {
	confirmEmail,
	createUser,
	deleteUser,
	editUser,
	getAllUsers,
	getUser,
	getUserImage,
	logInUser,
	makeAdmin,
	makeUser,
	updatePassword,
	updatePasswordRequest,
} from '../controllers/users.ts';
import { admin } from '../middlewares/admin.ts';
import { adminOrOwner } from '../middlewares/adminOrOwner.ts';
import { auth } from '../middlewares/auth.ts';
import { owner } from '../middlewares/owner.ts';
import { uploadImage } from '../services/userUploader.ts';
/* -------- ------ Initiating Router ------ -------- */
const router: Router = express.Router();
/* -------- -------- Getting users -------- -------- */
/**
 * @swagger
 * /users/getusers:
 *   get:
 *     summary: List users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Users returned }
 */
router.get('/getusers', auth, getAllUsers);
/**
 * @swagger
 * /users/getuser/{userId}:
 *   get:
 *     summary: Get a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: User returned }
 *       404: { description: User not found }
 */
router.get('/getuser/:userId', auth, getUser);
/**
 * @swagger
 * /users/images/{id}:
 *   get:
 *     summary: Download a user profile image
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Image file
 *         content:
 *           image/*:
 *             schema: { type: string, format: binary }
 *       404: { description: Image not found }
 */
router.get('/images/:id', getUserImage);
/* -------- -------- Sign in & up --------- -------- */
/**
 * @swagger
 * /users/signup:
 *   put:
 *     summary: Register a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/SignupInput' }
 *     responses:
 *       201: { description: User registered; confirmation email sent }
 *       400: { description: Invalid or duplicate user data }
 */
router.put('/signup', createUser);
/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Authenticate a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/LoginInput' }
 *     responses:
 *       200: { description: Authentication result and token }
 *       401: { description: Invalid credentials or unconfirmed account }
 */
router.post('/login', logInUser);
/* -------- -------- Confirm Email--------- -------- */
/**
 * @swagger
 * /users/confirm-email/{token}:
 *   get:
 *     summary: Confirm a user's email address
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Email confirmed }
 *       400: { description: Invalid or expired confirmation token }
 */
router.get('/confirm-email/:token', confirmEmail);
// There is no 'LogOut' algorithm in the Backend, logging out is losing
// the JWT auth token from the request headers in the Frontend localStorage
/* -------- -------- Edit & delete -------- -------- */
/**
 * @swagger
 * /users/edit/{userId}:
 *   patch:
 *     summary: Update a user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               email: { type: string, format: email }
 *               image: { type: string, format: binary }
 *     responses:
 *       200: { description: User profile updated }
 *       401: { description: Authentication or ownership required }
 */
router.patch('/edit/:userId', auth, owner, uploadImage, editUser);
/**
 * @swagger
 * /users/delete/{userId}:
 *   delete:
 *     summary: Delete a user account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: User deleted }
 *       401: { description: Authentication or ownership required }
 */
router.delete('/delete/:userId', auth, owner, deleteUser);
/* -------- -------- Password edit -------- -------- */
/**
 * @swagger
 * /users/update-password/{userId}:
 *   post:
 *     summary: Request a password update email
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Password update email sent }
 *       401: { description: Authentication or ownership required }
 */
router.post('/update-password/:userId', auth, owner, updatePasswordRequest);
// A token passed with the ID in the payload to update the password
/**
 * @swagger
 * /users/update-password/{token}:
 *   patch:
 *     summary: Set a new password using the emailed token
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password]
 *             properties:
 *               password: { type: string, format: password }
 *     responses:
 *       200: { description: Password updated }
 *       400: { description: Invalid or expired token }
 */
router.patch('/update-password/:token', updatePassword);
/* -------- -------- Admin control -------- -------- */
/**
 * @swagger
 * /users/admin/{userId}:
 *   put:
 *     summary: Promote a user to administrator
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: User promoted }
 *       403: { description: Administrator access required }
 */
router.put('/admin/:userId', auth, admin, makeAdmin);
/**
 * @swagger
 * /users/admin/{userId}:
 *   delete:
 *     summary: Revoke a user's administrator role
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Administrator role revoked }
 *       403: { description: Administrator or owner access required }
 */
router.delete('/admin/:userId', auth, adminOrOwner, makeUser);
/* -------- ------- Exporting Router ------ -------- */
export { router };
