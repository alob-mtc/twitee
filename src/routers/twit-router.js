import express from 'express';
const router = express.Router();
// the controller functions
import Controller from '../controllers';
const {
  postComment,
  listTwit,
  likeTwit,
  unlikeTwit,
  deleteTwit,
  postTwit,
} = Controller;
// the auth middleware
import { authMiddleware } from '../middlewares';
// the make express callback factory
import makeCallback from '../express-callback';
// the root end point
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello from comment service' });
});
// post comeent router
router.post('/post-comments', authMiddleware, makeCallback(postComment));
// post twit router
router.post('/post-twit', authMiddleware, makeCallback(postTwit));
// get twit router
router.get('/get-twits', authMiddleware, makeCallback(listTwit));
// like twit router
router.get('/like-twit/:id', authMiddleware, makeCallback(likeTwit));
// unlike twit router
router.delete('/unlike-twit/:id', authMiddleware, makeCallback(unlikeTwit));
// delete twit router
router.delete('/delete-twit/:id', authMiddleware, makeCallback(deleteTwit));

export default router;
