import express, { Router } from 'express';
import {
	createUser,
	deleteUser,
	editUser,
	getAllUsers,
	getUser,
	makeAdmin,
	logInUser,
	makeUser,
	updatePassword,
	confirmEmail,
} from '../controllers/users.ts';
import { admin } from '../middlewares/admin.ts';
import { auth } from '../middlewares/auth.ts';
import { owner } from '../middlewares/owner.ts';
import { adminOrOwner } from '../middlewares/adminOrOwner.ts';

const router: Router = express.Router();

/* -------- -------- Getting users -------- -------- */
router.get('/getusers', getAllUsers);
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
// // router.patch('/email/:userId', auth, owner, updateEmail);
router.patch('/password/:userId', auth, owner, updatePassword);
/* -------- -------- Admin control -------- -------- */
router.put('/admin/:userId', auth, admin, makeAdmin);
router.delete('/admin/:userId', auth, adminOrOwner, makeUser);

export { router };
