import { RequestHandler } from 'express';
import { verify } from 'jsonwebtoken';

interface UserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser: RequestHandler = async (req, res, next) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const payload = verify(
      req.session.jwt,
      process.env.JWT_KEY!,
    ) as UserPayload;

    req.currentUser = payload;
  } catch (error) {}

  next();
};
