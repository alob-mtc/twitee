// the twit service functions
import {
  makeDeleteTwit,
  makeLikeTwit,
  makeListTwit,
  makePostTwit,
  makeUnlikeTwit,
  makeAddComment,
} from './twit';
// dependencies => the data-access
// the makeTwitDb factory
import makeTwitDb from '../../data-access';
// make the Db interface that directly points the collection to be used => users collection, twits collection, comments collection, users collections
const twitDb = makeTwitDb({ collectionName: 'twits' });
const commentsDb = makeTwitDb({ collectionName: 'comments' });
const likeDb = makeTwitDb({ collectionName: 'likes' });
const userDb = makeTwitDb({ collectionName: 'users' });
/**
 * this is the twit service object
 * it the responsible for
 * posting Twit, deleting Twit, Adding Comment, liking Twit, unliking Twit, fetching Twits and comments
 */
const twitService = Object.freeze({
  addComment: makeAddComment({ commentsDb, twitDb }),
  deleteTwit: makeDeleteTwit({ twitDb, commentsDb, likeDb }),
  likeTwit: makeLikeTwit({ twitDb, userDb, likeDb }),
  listTwit: makeListTwit({ twitDb }),
  postTwit: makePostTwit({ twitDb, userDb }),
  unlikeTwit: makeUnlikeTwit({ likeDb }),
});

export default twitService;
