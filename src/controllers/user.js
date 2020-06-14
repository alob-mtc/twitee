/**
 *  sigin
 * @param {Function} sigin this sigin service funtion is responsible for the sigin functionality
 * @returns {Function} the sigin controller function
 * the sigin function takes in the req object and returns the res object based on the result of the service call
 */
export function makeSignin({ signin }) {
  return async function (httpRequest) {
    try {
      const authInfo = httpRequest.body;
      const auth = await signin(authInfo);
      return {
        headers: {
          'Content-Type': 'application/json',
          'Last-Modified': new Date(auth.modifiedOn).toUTCString(),
        },
        statusCode: 201,
        body: { status: 'success', data: auth },
      };
    } catch (e) {
      // TODO: Error logging
      console.log(e);

      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 400,
        body: {
          status: 'error',
          error: e.message,
        },
      };
    }
  };
}
/**
 *  signup
 * @param {Function} signup this signup service funtion is responsible for the signup functionality
 * @returns {Function} the signup controller function
 * the signup function takes in the req object and returns the res object based on the result of the service call
 */
export function makeSignup({ signup }) {
  return async function (httpRequest) {
    try {
      const authInfo = httpRequest.body;
      const auth = await signup(authInfo);
      return {
        headers: {
          'Content-Type': 'application/json',
          'Last-Modified': new Date(auth.modifiedOn).toUTCString(),
        },
        statusCode: 201,
        body: { status: 'success', data: auth },
      };
    } catch (e) {
      // TODO: Error logging
      console.log(e);

      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 400,
        body: {
          status: 'error',
          error: e.message,
        },
      };
    }
  };
}
/**
 *  signout
 * @param {Function} signout this signout service funtion is responsible for the signout functionality
 * @returns {Function} the signout controller function
 * the signout function takes in the req object and returns the res object based on the result of the service call
 */
export function makeSignout({ signout }) {
  return async function (httpRequest) {
    try {
      const { userId } = httpRequest.authObject;
      const auth = await signout({ userId });
      return {
        headers: {
          'Content-Type': 'application/json',
          'Last-Modified': new Date(auth.modifiedOn).toUTCString(),
        },
        statusCode: 201,
        body: { status: 'success', data: auth },
      };
    } catch (e) {
      // TODO: Error logging
      console.log(e);

      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 400,
        body: {
          status: 'error',
          error: e.message,
        },
      };
    }
  };
}
