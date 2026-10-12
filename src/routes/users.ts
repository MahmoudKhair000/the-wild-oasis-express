import express, { Router } from 'express';
import {
  createUser,
  deleteUser,
  editUser,
  getAllUsers,
  getUser,
  logInUser,
} from '../controllers/users.ts';
import { admin } from '../middlewares/admin.ts';
import { auth } from '../middlewares/auth.ts';

const router: Router = express.Router();

router.get('/', getAllUsers);
router.get('/:userId', getUser);

router.put('/', createUser);
router.post('/login/', logInUser);

router.patch('/:userId', auth, admin, editUser);
router.delete('/:userId', auth, admin, deleteUser);

export { router };

