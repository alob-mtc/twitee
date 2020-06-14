/**
 * twit entity
 *  this is responsible for creating and validating the twit entity in the application
 * @param {Object} Id this is responsible for Id generation and validation
 * @param {Function} md5 this is used for generating the unique hash for a twit
 * @param {Function} sanitize this is used for sanitazing HTML embeded text
 * @returns {Function} the make twit function => this is reponsible for creating a validating the twit entity
 */
export default function buildMakeTwit({ Id, md5, sanitize }) {
  return function makeTwit({
    userId,
    createdOn = Date.now(),
    _id = Id.makeId(),
    modifiedOn = Date.now(),
    text,
  } = {}) {
    if (!Id.isValidId(_id)) {
      throw new Error('Twit must have a valid id.');
    }
    if (!userId) {
      throw new Error('Twit must have an author.');
    }
    if (!text || text.length < 1) {
      throw new Error('Twit must include at least one character of text.');
    }
    // sanitize the comment
    let sanitizedText = sanitize(text).trim();
    if (sanitizedText.length < 1) {
      throw new Error('Twit contains no usable text.');
    }
    // the hash is responsible for preventing the duplication of a twit
    let hash;
    return Object.freeze({
      getUserId: () => userId,
      getCreatedOn: () => createdOn,
      getHash: () => hash || (hash = makeHash()),
      getId: () => _id,
      getModifiedOn: () => modifiedOn,
      getText: () => sanitizedText,
    });

    function makeHash() {
      return md5(sanitizedText + (userId || ''));
    }
  };
}
