import Entities from '../../entities';
// the make comment entity => responsible for creating and validating the comment entity
// the make like entity => responsible for creating and validating the like entity
// the make twit entity => responsible for creating and validating the twit entity
const { makeComment, makeLike, makeTwit } = Entities;
/**
 * post twit
 *  this is responsible for posting a new twit
 * @param {Object} twitDb the db interface for communicating with the db => the twits collection
 * @param {Object}  userDb the db interface for communicating with the db => the user collection
 * @returns {Function} the post twit function => this is reponsible for creating the twit validating it and returns it
 */
export function makePostTwit({ twitDb, userDb }) {
  return async function postTwit(twitInfo) {
    const twit = makeTwit(twitInfo);
    const [twitExists, userExists] = await Promise.all([
      twitDb.findByHash(twit.getHash()),
      userDb.findById(twit.getUserId()),
    ]);
    if (twitExists) {
      return exists;
    }
    if (!userExists) {
      throw new Error('The user does not exist');
    }
    const result = await twitDb.insert({
      userId: twit.getUserId(),
      hash: twit.getHash(),
      _id: twit.getId(),
      text: twit.getText(),
      createdOn: twit.getCreatedOn(),
      modifiedOn: twit.getModifiedOn(),
    });
    // the user's name is returned with the twit object
    return { ...result, userName: userExists.name };
  };
}

/**
 * get twit
 *  this is responsible for posting a new twit
 * @param {Object} twitDb the db interface for communicating with the db => the twits collection
 * @returns {Function} the list twit function => this is reponsible for fetching and returning all the twit
 * the list twit function uses the mongodb aggregation pippline(implemnted in the findTwit function in the twitee-db) to do a collection join
 * => it aggregation the twit comment, poster and likes associated to the twite
 */
export function makeListTwit({ twitDb }) {
  return async function listTwit({}) {
    return await twitDb.findTwit();
  };
}

/**
 * delete twit
 *  this is responsible for deleting(removing) twit
 * @param {Object} twitDb the db interface for communicating with the db => the twits collection
 * @returns {Function} the delete twit function => this is reponsible for removing twit => it returns and object { _id, deleted }, deleted is true if the twit was successful deleted
 * the delete twit function validates that the user trying to delete the twit is the author of the twit
 */
export function makeDeleteTwit({ twitDb }) {
  return async function deleteTwit({ _id, userId }) {
    if (!_id) {
      throw new Error('You must provide the twit id');
    }
    // check if the user is the owner of the twit
    const exists = await twitDb.find({ _id, userId });
    if (!exists[0]) {
      throw new Error('This twit was not posted by you');
    }
    const deleted = await twitDb.remove({ _id });
    return { _id, deleted };
  };
}

/**
 * like twit
 *  this is responsible for liking a twit
 * @param {Object} twitDb the db interface for communicating with the db => the twits collection
 * @param {Object}  userDb the db interface for communicating with the db => the user collection
 * @param {Object}  likeDb the db interface for communicating with the db => the like collection
 * @returns {Function} the like twit function => this is reponsible for creating  user likes for the twit => it returns the like object
 */
export function makeLikeTwit({ twitDb, userDb, likeDb }) {
  return async function likeTwit(likeInfo) {
    const like = makeLike(likeInfo);
    const [twitExists, userExists, alreadyLiked] = await Promise.all([
      twitDb.findById(like.getTwitId()),
      userDb.findById(like.getUserId()),
      // check if the user as already liked the twit
      likeDb.find({ twitId: like.getTwitId(), userId: like.getUserId() }),
    ]);
    // it the twit does not exit returh an error res to the user
    if (!twitExists) {
      throw new Error('The twit does not exist');
    }
    // it the user does not exit returh an error res to the client
    if (!userExists) {
      throw new Error('The user does not exist');
    }
    // check if a like made by this user for this twit already exist
    if (alreadyLiked[0]) {
      throw new Error('You can only like this twit once');
    }
    return likeDb.insert({
      userId: like.getUserId(),
      _id: like.getId(),
      twitId: like.getTwitId(),
      createdOn: like.getCreatedOn(),
      modifiedOn: like.getModifiedOn(),
    });
  };
}

/**
 * unlike twit
 *  this is responsible for unlike functionality
 * @param {Object}  likeDb the db interface for communicating with the db => the like collection
 * @returns {Function} the unlike twit function => this is reponsible for removing user likes for the twit => it returns { _id, unlike }, where unlike is true is the action is successful
 */
export function makeUnlikeTwit({ likeDb }) {
  return async function unlikeTwit({ twitId, userId }) {
    if (!twitId) {
      throw new Error('You must provide the twit id');
    }
    if (!userId) {
      throw new Error('you must provide the user id');
    }
    const likeExist = await likeDb.find({ twitId, userId });
    if (!likeExist[0]) {
      throw new Error('You did not liked this twit');
    }
    const unlike = await likeDb.remove({
      _id: likeExist[0]._id,
    });
    return { _id: likeExist[0]._id, unlike };
  };
}
/**
 *  this is the make add comment factory => it builds the add comment function
 * @param {Object} commentsDb the db interfact for comminicating with the comments collection
 * @param {Object} twitDb the db interfact for comminicating with the twit collection
 * @returns {Function} (addComment) the add Comment fuction(post comment) this is responsible for adding comment to a twit
 * the addComment function takes the comment object validate it with the makeComment funtion(entity) and returns the comment object
 */
export function makeAddComment({ commentsDb, twitDb }) {
  return async function addComment(commentInfo) {
    const comment = makeComment(commentInfo);
    const [commentExists, postExists] = await Promise.all([
      commentsDb.findByHash(comment.getHash()),
      twitDb.findById(commentInfo.twitId),
    ]);
    if (commentExists) {
      return exists;
    }
    if (!postExists) {
      throw new Error('The twit does not exist');
    }
    return commentsDb.insert({
      userId: comment.getUserId(),
      hash: comment.getHash(),
      _id: comment.getId(),
      text: comment.getText(),
      twitId: comment.getTwitId(),
      createdOn: comment.getCreatedOn(),
      modifiedOn: comment.getModifiedOn(),
    });
  };
}
