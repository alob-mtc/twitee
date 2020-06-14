// the dependencies
import crypto from 'crypto';
import Id from '../modules/id';
import sanitizeHtml from 'sanitize-html';
import buildMakeComment from './comment';
import buildMakeTwit from './twit';
import buildMakeLike from './like';
import buildMakeUser from './user';
// helper functions
// the Hash class => responsible for encryption and decription of password using bcryptjs
import Hash from '../modules/hash';
const { generateHash, verifyHash } = Hash;
// the entity factory => they build and return the entity factories
const makeComment = buildMakeComment({ Id, md5, sanitize });
const makeTwit = buildMakeTwit({ Id, md5, sanitize });
const makeLike = buildMakeLike({ Id });
const makeUser = buildMakeUser({ Id, generateHash, verifyHash });

export default Object.freeze({ makeComment, makeTwit, makeUser, makeLike });

export function md5(text) {
  return crypto.createHash('md5').update(text, 'utf-8').digest('hex');
}

function sanitize(text) {
  // TODO: allow more coding embeds
  return sanitizeHtml(text, {
    allowedIframeHostnames: ['codesandbox.io', 'repl.it'],
  });
}
