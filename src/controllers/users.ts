import type { Request, Response } from 'express';
import { usersModel } from '../models/users.ts';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
  try {
    const userDoc = await usersModel.create(newUser);
    res.status(200).json({
      ok: false,
      message: 'Created user successfully!',
      reqBody: newUser,
      user: {
        _id: userDoc._id,
        firstName: userDoc.firstName,
        lastName: userDoc.lastName,
        email: userDoc.email,
        role: userDoc._role,
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

// let testUser = {
// 	firstName: 'Mahmoud',
// 	lastName: 'Khair',
// 	email: 'mahmoud4test@example.com',
// 	password: 'pass4test',
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

  try {
    const user = await usersModel.findOne({ email });
    if (!user) {
      res.status(404).json({
        ok: false,
        message: "There' no user assigned to that email",
      });
      return;
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (isValid) {
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        res.status(500).json({
          ok: false,
          message: 'Authentication is not configured',
        });
        return;
      }

      const token = jwt.sign({ userId: user._id }, jwtSecret, {
        expiresIn: '1h',
      });

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
  res.status(300).json({
    ok: true,
    message: `making ${req.method} request from '${req.protocol}://${req.host + req.originalUrl}'`,
  });
};

export const deleteUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  res.status(300).json({
    ok: true,
    message: `making ${req.method} request from '${req.protocol}://${req.host + req.originalUrl}'`,
  });
};
