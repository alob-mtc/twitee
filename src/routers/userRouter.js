import express from 'express';
const router = express.Router();
// the controller
import userController from '../controllers';
// the make express callback factory
import makeCallback from '../express-callback';
// the controller function
const { signout, signup, signin } = userController;
// the auth middleware
import { authMiddleware } from '../middlewares';
// the root end point
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello from User service' });
});
// the sigin router
router.post('/signin', makeCallback(signin));
//  the signup router
router.post('/signup', makeCallback(signup));
//  the signout endpoint
router.post('/signout', authMiddleware, makeCallback(signout));

export default router;
