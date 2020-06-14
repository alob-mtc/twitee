/**
 * User entity
 *  this is responsible for creating and validating the user entity in the application
 * @param {Object} Id this is responsible for Id generation and validation
 * @param {Function} generateHash this is used for encrypting the users password
 * @param {Function} verifyHash this is used for verifying the users password
 * @returns {Function} the make user function => this is reponsible for creating a validating the user entity
 */
export default function buildMakeUser({ Id, generateHash, verifyHash }) {
  return function makeUser({
    _id = Id.makeId(),
    name,
    email,
    password,
    isAdmin = false,
    createdOn = Date.now(),
  } = {}) {
    if (!Id.isValidId(_id)) {
      throw new Error('user must have a valid id.');
    }
    //TODO: validate the email
    if (!email) {
      throw new Error('user must have an email');
    }
    // get the user name from the email
    name = email.split('@')[0];
    if (!name) {
      throw new Error('user must have a name');
    }
    if (!password) {
      throw new Error('user must have a password');
    }

    // the setter and getters
    return Object.freeze({
      getId: () => _id,
      getName: () => name,
      getEmail: () => email,
      encryptPassword: () => (password = generateHash(password)),
      getPassword: () => password,
      validPassword: (rawPassword) => verifyHash(password, rawPassword),
      getRole: () => isAdmin,
      getCreatedOn: () => createdOn,
    });
  };
}
