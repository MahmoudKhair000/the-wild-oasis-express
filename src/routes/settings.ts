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
/**
 * @swagger
 * /settings:
 *   get:
 *     summary: Get application settings
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Settings returned }
 */
router.get('/', auth, getSettings);
/**
 * @swagger
 * /settings:
 *   post:
 *     summary: Update application settings
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/SettingsInput' }
 *     responses:
 *       200: { description: Settings updated }
 */
router.post('/', auth, editSettings);
/**
 * @swagger
 * /settings/reset:
 *   put:
 *     summary: Reset settings to defaults
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Settings reset }
 *       403: { description: Administrator access required }
 */
router.put('/reset', auth, admin, resetSettings);

export { router };
