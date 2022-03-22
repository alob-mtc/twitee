/**
 * i decieded to go for the same response message for all login authentication error
 * the reason for this is to secure the appliction from brut-force attack
 * so that the attacker will not know which signin credentials are valid ones
 * credentials =>
 *  1. email
 *  2. password
 * for wrong email or password the error message remains consistent for both error cases
 */
import Entity from '../../entities';
// the make user entity funtion => responsible for creating and validating the user entity
const { makeUser } = Entity;

/**
 * signin
 *  this is responsible for the user signin
 * @param {Object} userDb the db interface for communicating with the db
 * @param {Function} generateToken this is used for generating the auth token
 * @returns {Function} the login function => this is reponsible for authenticating the user and generating the auth object + auth token used be the client
 * the login funtion takes the user email and password as params
 */
export function makeSignin({ userDb, generateToken }) {
  return async function login({ email, password }) {
    if (!email) {
      throw new Error('You must supply an email!');
    }
    if (!password) {
      throw new Error('You must supply a password!');
    }
    const exits = await userDb.findByEmail(email);
    if (!exits) {
      throw new Error('Auth Failed.');
    }
    const authUser = makeUser(exits);
    if (!authUser.validPassword(password)) {
      throw new Error('Auth failed.');
    }
    // generate the token plus other meta-data to be sent to the client
    const token = generateToken({
      payload: {
        userId: authUser.getId(),
        isAdmin: authUser.getRole(),
      },
    });
    return {
      token,
      user: { _id: authUser.getId(), isAdmin: authUser.getRole() },
    };
  };
}

/**
 *
 * @param {Object} userDb the db interface for communicating with the db
 */
export function makeSignout({ userDb }) {}

/**
 * signup
 *  this is responsible for the user signup
 * @param {Object} userDb the db interface for communicating with the db
 * @param {Function} signin the sign function
 * @returns {Function} the signup funtion => this is responsible for registring the users
 * the signup function calls login function and return the auth object + auth token used be the client
 * the login logic is reused directly in the signup function
 */
export function makeSignup({ userDb, signin }) {
  return async function signup(userInfo) {
    const user = makeUser({ ...userInfo });
    const exit = await userDb.findByEmail(user.getEmail());
    if (exit) {
      // this error message is delibrate
      throw new Error('Signup failed, You are already registered');
    }
    user.encryptPassword()
    await userDb.insert({
      _id: user.getId(),
      email: user.getEmail(),
      password: user.getPassword(),
      name: user.getName(),
      isAdmin: user.getRole(),
      createdOn: user.getCreatedOn(),
    });
    // this automaticaly logs the user in by generating the approprate auth token when the user is succesfully created(signed up)
    return signin({ email: user.getEmail(), password: userInfo.password });
  };
}
