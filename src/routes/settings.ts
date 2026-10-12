import express, { type Router } from 'express';
import {
	editSettings,
	getSettings,
	resetSettings,
} from '../controllers/settings.ts';
import { admin } from '../middlewares/admin.ts';
import { auth } from '../middlewares/auth.ts';

const router: Router = express.Router();

/* ------ ------ The Main API ------ ------ */
router.get('/', auth, getSettings);
router.post('/', auth, admin, editSettings);
router.put('/reset', auth, admin, resetSettings);

export { router };

