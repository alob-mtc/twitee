import { makePostTwit, makePostComment } from './twit';
import makeFakeTwit from '../../__test__/fixtures/twit';
import makeFakeComment from '../../__test__/fixtures/comment';
// Twit test
describe('post twit controller', () => {
  it('successfully posts a twit', async () => {
    const postTwit = makePostTwit({ postTwit: (c) => c });
    const twit = makeFakeTwit();
    const request = {
      headers: {
        'Content-Type': 'application/json',
      },
      body: twit,
      authObject: { userId: twit.userId },
    };
    const expected = {
      headers: {
        'Content-Type': 'application/json',
        'Last-Modified': new Date(request.body.modifiedOn).toUTCString(),
      },
      statusCode: 201,
      body: { status: 'success', data: request.body },
    };
    const actual = await postTwit(request);
    expect(actual).toEqual(expected);
  });
  it('reports user errors', async () => {
    const postComment = makePostTwit({
      postTwit: () => {
        throw Error('Pow!');
      },
    });
    const fakeTwit = makeFakeTwit();
    const request = {
      headers: {
        'Content-Type': 'application/json',
      },
      body: fakeTwit,
      authObject: { userId: fakeTwit.userId },
    };
    const expected = {
      headers: {
        'Content-Type': 'application/json',
      },
      statusCode: 400,
      body: { status: 'error', error: 'Pow!' },
    };
    const actual = await postComment(request);
    expect(actual).toEqual(expected);
  });
});
// Comment test
describe('post comment controller', () => {
  it('successfully posts a comment', async () => {
    const postComment = makePostComment({ addComment: (c) => c });
    const comment = makeFakeComment();
    const request = {
      headers: {
        'Content-Type': 'application/json',
      },
      authObject: { userId: comment.userId },
      body: comment,
    };
    const expected = {
      headers: {
        'Content-Type': 'application/json',
        'Last-Modified': new Date(request.body.modifiedOn).toUTCString(),
      },
      statusCode: 201,
      body: { status: 'success', data: request.body },
    };
    const actual = await postComment(request);
    expect(actual).toEqual(expected);
  });
  it('reports user errors', async () => {
    const postComment = makePostComment({
      addComment: () => {
        throw Error('Pow!');
      },
    });
    const fakeComment = makeFakeComment();
    const request = {
      headers: {
        'Content-Type': 'application/json',
      },
      body: fakeComment,
      authObject: { userId: fakeComment.userId },
    };
    const expected = {
      headers: {
        'Content-Type': 'application/json',
      },
      statusCode: 400,
      body: { status: 'error', error: 'Pow!' },
    };
    const actual = await postComment(request);
    expect(actual).toEqual(expected);
  });
});
