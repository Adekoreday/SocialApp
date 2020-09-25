import express from 'express';
import Followers from '../Controllers/Followers';
import { verifyToken } from '../middlewares';

const route = express.Router();

route.post(
  '/:username/follow',
  verifyToken,
  Followers.follow
);
route.delete(
  '/:username/follow',
  verifyToken,
  Followers.unfollow
);

export default route;
