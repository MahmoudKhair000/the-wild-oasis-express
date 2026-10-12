import type { NextFunction, Request, Response } from 'express';
import { usersModel } from '../models/users.ts';

interface AuthLocals {
  userId: string;
}

export async function admin(
  _req: Request,
  res: Response<unknown, AuthLocals>,
  next: NextFunction,
): Promise<void> {
  const user = await usersModel.findById(res.locals.userId).select('_role');
  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (user._role !== 'admin') {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  next();
}