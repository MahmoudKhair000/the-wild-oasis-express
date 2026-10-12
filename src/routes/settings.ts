import express, { type Router } from 'express';
import {
	getSettings,
	editSettings,
	resetSettings,
} from '../controllers/settings.ts';

const router: Router = express.Router();

router.get('/', getSettings);
router.post('/', editSettings);
router.put('/reset', resetSettings);

export { router };
