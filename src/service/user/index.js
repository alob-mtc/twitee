// dependencies => the data-access
// the makeTwitDb factory
import makeTwitDb from '../../data-access';
// make the Db interface that directly points the collection to be used => users collection
const userDb = makeTwitDb({ collectionName: 'users' });
//  the JWT helper function => handles generation and verification of jwt token
import JWT from '../../modules/auth';
// services
import { makeSignin, makeSignup, makeSignout } from './authObject';
// build the login function with its dependencies => db_interface, generateToken
const login = makeSignin({
  userDb,
  generateToken: JWT.genToken,
});
/**
 * this is the auth service object
 * if the responsible for
 * loging up(user registration), loging in(login), siging out(logout)
 */
const authService = Object.freeze({
  login,
  // build the signup function with its dependencies => db_interface, sigin(this help to sigin the user in as soon as they are registered)
  signup: makeSignup({ userDb, login }),
  // build the signout function with its dependencies
  signout: makeSignout({}),
});

export default authService;
