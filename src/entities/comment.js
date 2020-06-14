/**
 * comment entity
 *  this is responsible for creating and validating the comment entity in the application
 * @param {Object} Id this is responsible for Id generation and validation
 * @param {Function} md5 this is used for generating the unique hash for a comment
 * @param {Function} sanitize this is used for sanitazing HTML embeded text
 * @returns {Function} the make Comment function => this is reponsible for creating a validating the comment entity
 */
export default function buildMakeComment({ Id, md5, sanitize }) {
  return function makeComment({
    userId,
    _id = Id.makeId(),
    twitId,
    text,
    createdOn = Date.now(),
    modifiedOn = Date.now(),
  } = {}) {
    if (!Id.isValidId(_id)) {
      throw new Error('Comment must have a valid id.');
    }
    if (!userId) {
      throw new Error('Comment must have an author.');
    }
    if (!twitId) {
      throw new Error('Comment must contain a twitId.');
    }
    if (!text || text.length < 1) {
      throw new Error('Comment must include at least one character of text.');
    }
    // sanitize the comment
    let sanitizedText = sanitize(text).trim();
    if (sanitizedText.length < 1) {
      throw new Error('Comment contains no usable text.');
    }
    // the hash is responsible for preventing the duplication of a twit
    let hash;
    return Object.freeze({
      getUserId: () => userId,
      getHash: () => hash || (hash = makeHash()),
      getId: () => _id,
      getTwitId: () => twitId,
      getText: () => sanitizedText,
      getCreatedOn: () => createdOn,
      getModifiedOn: () => modifiedOn,
    });

    function makeHash() {
      return md5(sanitizedText + (userId || '') + (twitId || ''));
    }
  };
}
