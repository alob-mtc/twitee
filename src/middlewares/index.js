// the admin checker middleware
// the validate that the user trying to make the request is an admin
import JWT from '../modules/auth';
const { verifyToken: authVerify } = JWT;
// the auth checker middleware
// this validate that the user try to make the request is signed in
// this set the current signed in user on the req object using the authObject field
export function authMiddleware(req, res, next) {
  // extract the token
  const auth = req.get('Authorization');
  const token = auth && auth.split(' ')[1];
  if (!token) {
    // respond with an error message if an error occured
    res.type('json');
    res
      .status(401)
      .send({
        status: 'error',
        error:
          'Not authorized to make this request, token is invalid or expired',
      })
      .end();
    return;
  }
  try {
    //  verify that the token is valid
    const decodedToken = authVerify({ token });
    if (decodedToken) {
      const newAuth = {
        userId: decodedToken.data.userId,
        isAdmin: decodedToken.data.isAdmin,
      };
      //   set the user on the req object using the authobject field
      req.authObject = newAuth;
      next();
    } else {
      // respond with an error message if an error occured
      res.type('json');
      res
        .status(401)
        .send({
          status: 'error',
          error:
            'Not authorized to make this request, token is invalid or expired',
        })
        .end();
    }
  } catch (error) {
    // respond with an error message if an error occured
    res.type('json');
    res
      .status(401)
      .send({
        status: 'error',
        error:
          'Not authorized to make this request, token is invalid or expired',
      })
      .end();
  }
}
