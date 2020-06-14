/**
 * like entity
 *  this is responsible for creating and validating the like entity in the application
 * @param {Object} Id this is responsible for Id generation and validation
 * @returns {Function} the make like function => this is reponsible for creating a validating the like entity
 */
export default function buildMakeLike({ Id }) {
  return function makeLike({
    userId,
    createdOn = Date.now(),
    _id = Id.makeId(),
    modifiedOn = Date.now(),
    twitId,
  } = {}) {
    if (!Id.isValidId(_id)) {
      throw new Error('Like must have a valid id.');
    }
    if (!userId) {
      throw new Error('Like must have a userId.');
    }
    // if (!Id.isValidId(authorId)) {
    //   throw new Error('Comment must have a valid auth id');
    // }
    if (!twitId) {
      throw new Error('Like must contain a twitId.');
    }
    return Object.freeze({
      getUserId: () => userId,
      getCreatedOn: () => createdOn,
      getId: () => _id,
      getModifiedOn: () => modifiedOn,
      getTwitId: () => twitId,
    });
  };
}
