import express, { type Router } from 'express';
import {
	confirmEmail,
	createUser,
	deleteUser,
	editUser,
	getAllUsers,
	getUser,
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
/* -------- ------ Initiating Router ------ -------- */
const router: Router = express.Router();
/* -------- -------- Getting users -------- -------- */
router.get('/getusers', auth, getAllUsers);
router.get('/getuser/:userId', auth, getUser);
/* -------- -------- Sign in & up --------- -------- */
router.put('/signup', createUser);
router.post('/login', logInUser);
/* -------- -------- Confirm Email--------- -------- */
router.get('/confirm-email/:token', confirmEmail);
// There is no 'LogOut' algorithm in the Backend, logging out is losing
// the JWT auth token from the request headers in the Frontend localStorage
/* -------- -------- Edit & delete -------- -------- */
router.patch('/edit/:userId', auth, owner, editUser);
router.delete('/delete/:userId', auth, owner, deleteUser);
/* -------- -------- Password edit -------- -------- */
router.post('/update-password/:userId', auth, owner, updatePasswordRequest);
// A token passed with the ID in the payload to update the password
router.patch('/update-password/:token', updatePassword);
/* -------- -------- Admin control -------- -------- */
router.put('/admin/:userId', auth, admin, makeAdmin);
router.delete('/admin/:userId', auth, adminOrOwner, makeUser);
/* -------- ------- Exporting Router ------ -------- */
export { router };
