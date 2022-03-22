// dependencies => the data-access
// the makeTwitDb factory
import makeTwitDb from '../../data-access';
// make the Db interface that directly points the collection to be used => users collection
const userDb = makeTwitDb({ collectionName: 'users' });
//  the JWT helper function => handles generation and verification of jwt token
import JWT from '../../modules/auth';
// services
import { makeSignin, makeSignup, makeSignout } from './authObject';
// build the signin function with its dependencies => db_interface, generateToken
const signin = makeSignin( {
  userDb,
  generateToken: JWT.genToken,
});
/**
 * this is the auth service object
 * if the responsible for
 * signing up(user registration), signing in(login), siging out(logout)
 */
const authService = Object.freeze({
  signin  ,
  // build the signup function with its dependencies => db_interface, sigin(this help to sigin the user in as soon as they are registered)
  signup: makeSignup({ userDb, signin }),
  // build the signout function with its dependencies
  signout: makeSignout({}),
});

export default authService;
