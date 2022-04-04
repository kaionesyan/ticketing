import express from 'express';
import { currentUser } from '@kow-ticketing/common';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, async (req, res) => {
  return res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
