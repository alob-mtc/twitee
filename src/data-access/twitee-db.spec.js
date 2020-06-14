import makeDb from '../../__test__/fixtures/db';
import buildMakeTwiteeDb from './twitee-db';
import makeFakeComment from '../../__test__/fixtures/comment';
import makeFakeUser from '../../__test__/fixtures/user';
import makeFakeTwit from '../../__test__/fixtures/twit';
import makeFakeLike from '../../__test__/fixtures/like';

/**
 * this test is independent of collection name
 * the objective of the test is to test all the db interface functions
 * findAll, findByHash, findById, findByTwitId, findByEmail, findByUserId, insert, remove, update,
 */

describe('twitee db', () => {
  let testDb;

  beforeEach(async () => {
    const makeTwiteeDb = buildMakeTwiteeDb({ makeDb });
    testDb = makeTwiteeDb({ collectionName: 'testcollection' });
  });

  it('find documents', async () => {
    const inserts = await Promise.all(
      [
        makeFakeComment({ userId: '123' }),
        makeFakeComment({ userId: '123' }),
        makeFakeComment({ userId: '123' }),
      ].map(testDb.insert),
    );
    const found = await testDb.find({ userId: '123' });
    expect.assertions(inserts.length);
    return inserts.forEach((insert) => expect(found).toContainEqual(insert));
  });

  it('inserts a document', async () => {
    const comment = makeFakeComment();
    const result = await testDb.insert(comment);
    return expect(result).toEqual(comment);
  });

  it('finds a document by id', async () => {
    const comment = makeFakeComment();
    await testDb.insert(comment);
    const found = await testDb.findById(comment._id);
    expect(found).toEqual(comment);
  });

  it("finds a document by it's hash", async () => {
    const fakeCommentOne = makeFakeComment();
    const fakeCommentTwo = makeFakeComment();
    const insertedOne = await testDb.insert(fakeCommentOne);
    const insertedTwo = await testDb.insert(fakeCommentTwo);

    expect(await testDb.findByHash(fakeCommentOne.hash)).toEqual(insertedOne);
    expect(await testDb.findByHash(fakeCommentTwo.hash)).toEqual(insertedTwo);
  });

  it('finds a document by email', async () => {
    const user = makeFakeUser();
    await testDb.insert(user);
    const result = await testDb.findByEmail(user.email);
    return expect(result).toEqual(user);
  });

  it('finds a document by userId', async () => {
    const comment = makeFakeComment();
    await testDb.insert(comment);
    const result = await testDb.findByUserId(comment.userId);
    return expect(result[0]).toEqual(comment);
  });

  it('finds a document by twitId', async () => {
    const comment = makeFakeComment();
    await testDb.insert(comment);
    const result = await testDb.findByTwitId(comment.twitId);
    return expect(result[0]).toEqual(comment);
  });

  it('updates a document', async () => {
    const comment = makeFakeComment();
    await testDb.insert(comment);
    comment.text = 'changed';
    const updated = await testDb.update(comment);
    return expect(updated.text).toBe('changed');
  });

  it('deletes a document', async () => {
    const comment = makeFakeComment();
    await testDb.insert(comment);
    return expect(await testDb.remove(comment)).toBe(true);
  });
});

describe('the find twit aggregation test', () => {
  let commentDb;
  let twitDb;
  let userDb;
  let likeDb;

  beforeEach(async () => {
    const makeTwiteeDb = buildMakeTwiteeDb({ makeDb });
    commentDb = makeTwiteeDb({ collectionName: 'comments' });
    twitDb = makeTwiteeDb({ collectionName: 'twits' });
    userDb = makeTwiteeDb({ collectionName: 'users' });
    likeDb = makeTwiteeDb({ collectionName: 'likes' });
  });

  it('finds twit', async () => {
    const comment_1 = makeFakeComment();
    const comment_2 = makeFakeComment();
    const user = makeFakeUser();
    const twit = makeFakeTwit({ userId: user._id });
    const like_1 = makeFakeLike({ userId: user._id, twitId: twit._id });
    const like_2 = makeFakeLike({ userId: user._id, twitId: twit._id });
    comment_1.twitId = twit._id;
    comment_2.twitId = twit._id;
    await Promise.all([
      commentDb.insert(comment_1),
      commentDb.insert(comment_2),
      likeDb.insert(like_1),
      likeDb.insert(like_2),
      userDb.insert(user),
      twitDb.insert(twit),
    ]);
    let result = await twitDb.findTwit(twit._id);
    result = result[result.length - 1];
    expect(result.comment.length).toBe(2);
    expect(result.poster.length).toBe(1);
    expect(result.likes.length).toBe(2);
    expect(result.comment[1]).toEqual(comment_2);
    expect(result.poster[0]).toEqual(user);
    return;
  });
});
