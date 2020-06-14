/**
 *  Controller
 * @param {Function} theServiceFunction
 * @returns {Function} the controller function
 * the controller function takes in the req object and returns the res object based on the result of the service call
 */
// ======================================

export function makeGetTwit({ listTwit }) {
  return async function () {
    const headers = {
      'Content-Type': 'application/json',
    };
    try {
      const twits = await listTwit({});
      return {
        headers,
        statusCode: 200,
        body: { status: 'success', data: twits },
      };
    } catch (e) {
      // TODO: Error logging
      console.log(e);
      return {
        headers,
        statusCode: 400,
        body: {
          status: 'error',
          error: e.message,
        },
      };
    }
  };
}

export function makePostTwit({ postTwit }) {
  return async function (httpRequest) {
    try {
      const twitInfo = httpRequest.body;
      const { userId } = httpRequest.authObject;
      const posted = await postTwit({ ...twitInfo, userId });
      return {
        headers: {
          'Content-Type': 'application/json',
          'Last-Modified': new Date(posted.modifiedOn).toUTCString(),
        },
        statusCode: 201,
        body: { status: 'success', data: posted },
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
//
export function makeDeleteTwit({ deleteTwit }) {
  return async function (httpRequest) {
    try {
      const { id: _id } = httpRequest.params;
      const { userId } = httpRequest.authObject;
      const posted = await deleteTwit({ _id, userId });
      return {
        headers: {
          'Content-Type': 'application/json',
          'Last-Modified': new Date(posted.modifiedOn).toUTCString(),
        },
        statusCode: 201,
        body: { status: 'success', data: posted },
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
//
export function makeLikeTwit({ likeTwit }) {
  return async function (httpRequest) {
    try {
      const { id: twitId } = httpRequest.params;
      const { userId } = httpRequest.authObject;
      const like = await likeTwit({ twitId, userId });
      return {
        headers: {
          'Content-Type': 'application/json',
          'Last-Modified': new Date(like.modifiedOn).toUTCString(),
        },
        statusCode: 201,
        body: { status: 'success', data: like },
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
//
export function makeUnlikeTwit({ unlikeTwit }) {
  return async function (httpRequest) {
    try {
      const { id: twitId } = httpRequest.params;
      const { userId } = httpRequest.authObject;
      const like = await unlikeTwit({ twitId, userId });
      return {
        headers: {
          'Content-Type': 'application/json',
          'Last-Modified': new Date(like.modifiedOn).toUTCString(),
        },
        statusCode: 201,
        body: { status: 'success', data: like },
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
//
export function makePostComment({ addComment }) {
  return async function (httpRequest) {
    try {
      const commentInfo = httpRequest.body;
      const { userId } = httpRequest.authObject;
      const posted = await addComment({
        ...commentInfo,
        userId,
      });
      return {
        headers: {
          'Content-Type': 'application/json',
          'Last-Modified': new Date(posted.modifiedOn).toUTCString(),
        },
        statusCode: 201,
        body: { status: 'success', data: posted },
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
