// the twit service funtions
import twitService from '../service/twit';
const {
  addComment,
  deleteTwit,
  likeTwit,
  listTwit,
  postTwit,
  unlikeTwit,
} = twitService;
// the auth service funtion
import userService from '../service/user';
const { signin, signout, signup } = userService;
// the controller factory for the controller function
import {
  makePostComment,
  makeDeleteTwit,
  makeGetTwit,
  makeLikeTwit,
  makePostTwit,
  makeUnlikeTwit,
} from './twit';
import { makeSignin, makeSignout, makeSignup } from './user';

/**
 * this the controller object the is responsible for
 * getting Comment, posting Comment, deleting comment, liking twit, unliking twit, posting twit, getting twit
 */
const Controller = Object.freeze({
  // the twit controller functions
  postComment: makePostComment({ addComment }),
  deleteTwit: makeDeleteTwit({ deleteTwit }),
  likeTwit: makeLikeTwit({ likeTwit }),
  listTwit: makeGetTwit({ listTwit }),
  postTwit: makePostTwit({ postTwit }),
  unlikeTwit: makeUnlikeTwit({ unlikeTwit }),
  // the auth controller functions
  signin: makeSignin({ signin }),
  signup: makeSignup({ signup }),
  signout: makeSignout({ signout }),
});

export default Controller;
