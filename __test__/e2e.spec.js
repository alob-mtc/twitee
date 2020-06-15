import axios from 'axios';
import http from 'http';
import app from '../src/app';
import makeTwiteeDb from '../src/data-access';
import makeDb from './fixtures/db';
import makeFakeComment from './fixtures/comment';
import makeFakeTwit from './fixtures/twit';
import makeFakeLike from './fixtures/like';
import makeFakeUser from './fixtures/user';
import dotenv from 'dotenv';
import { date } from 'faker';
dotenv.config();
//the server object
let server;

describe('Twitee API', () => {
  beforeAll(() => {
    //spinup a new web server
    server = http.createServer(app);
    server.listen(3000);

    //the axios config
    axios.defaults.baseURL = process.env.DM_BASE_URL + 'api/v1';
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    axios.defaults.validateStatus = function (status) {
      // Throw only if the status code is greater than or equal to 500
      return status < 500;
    };
  });
  afterAll(async () => {
    // close and teardown the server
    server.close();
  });

  describe('comments', () => {
    beforeEach((done) => setTimeout(() => done(), 1100));
    // test the add comment functionlity
    it('adds a comment to a twit', async () => {
      // insert a test twit
      const fakeTwit = makeFakeTwit();
      const db = await makeDb();
      const commentsDb = makeTwiteeDb({ collectionName: 'comments' });
      await db.collection('twits').insert(fakeTwit);
      // ====================
      const auth = await axios.post(
        '/user/signup',
        makeFakeUser({
          _id: undefined,
        }),
      );
      const {
        data: {
          token,
          user: { _id },
        },
      } = auth.data;
      // =====================
      const fakeComment = makeFakeComment({
        _id: undefined,
        hash: undefined,
        userId: undefined,
        text: 'Something safe and intelligible.',
        twitId: fakeTwit._id,
      });
      const response = await axios({
        method: 'post',
        url: '/twit/post-comments',
        data: fakeComment,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${token}`,
        },
      });
      expect(response.status).toBe(201);
      const { data: posted } = response.data;
      const doc = await commentsDb.findById(posted._id);
      expect(doc).toEqual(posted);
      expect(posted.text).toBe(fakeComment.text);
      expect(posted.twitId).toBe(fakeTwit._id);
      expect(posted.userId).toBe(_id);
      expect(posted.hash).toBeDefined();
      expect(posted.createdOn).toBeDefined();
      expect(posted.modifiedOn).toBeDefined();
      return commentsDb.remove(posted);
    });
  });
  describe('users', () => {
    // test sign up functionality
    it('user sign up', async () => {
      const fakeUser = makeFakeUser({ _id: undefined });
      const auth = await axios.post('/user/signup', fakeUser);
      const { data, status } = auth.data;
      expect(auth.status).toBe(201);
      expect(data.token).toBeDefined();
      expect(data.user).toBeDefined();
      expect(data.user._id).toBeDefined();
      expect(data.user.isAdmin).toBeDefined();
      expect(status).toBe('success');
    });
    // test signin functionlity
    it('user signin', async () => {
      // ==================== insert a user befor handle for the signin test
      await axios.post(
        '/user/signup',
        makeFakeUser({
          _id: undefined,
          email: 'test@gmail.com',
          password: 'test',
        }),
      );
      // =====================
      const response = await axios.post('/user/signin', {
        email: 'test@gmail.com',
        password: 'test',
      });
      const { data, status } = response.data;
      expect(response.status).toBe(201);
      expect(data.token).toBeDefined();
      expect(data.user).toBeDefined();
      expect(data.user._id).toBeDefined();
      expect(data.user.isAdmin).toBeDefined();
      expect(status).toBe('success');
      const db = await makeDb();
      return db.collection('users').remove(data.user);
    });
  });
  describe('twits', () => {
    // test the list comment functionality
    it('list twit', async () => {
      const twitDb = makeTwiteeDb({ collectionName: 'twits' }),
        commentDb = makeTwiteeDb({ collectionName: 'comments' }),
        likeDb = makeTwiteeDb({ collectionName: 'likes' });
      // ====================
      const fakeUser = makeFakeUser({
        _id: undefined,
      });
      const auth = await axios.post('/user/signup', fakeUser);
      const {
        data: {
          token,
          user: { _id },
        },
      } = auth.data;
      // =====================

      const comment_1 = makeFakeComment();
      const comment_2 = makeFakeComment();
      const twit = makeFakeTwit({ userId: _id });
      const like_1 = makeFakeLike({ userId: _id, twitId: twit._id });
      const like_2 = makeFakeLike({ userId: _id, twitId: twit._id });
      comment_1.twitId = twit._id;
      comment_2.twitId = twit._id;
      await Promise.all([
        commentDb.insert(comment_1),
        commentDb.insert(comment_2),
        likeDb.insert(like_1),
        likeDb.insert(like_2),
        twitDb.insert(twit),
      ]);
      let result = await axios({
        method: 'get',
        url: '/twit/get-twits',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${token}`,
        },
      });
      result = result.data.data[result.data.data.length - 1];
      expect(result.comment.length).toBe(2);
      expect(result.poster.length).toBe(1);
      expect(result.likes.length).toBe(2);
      expect(result.comment[1]).toEqual(comment_2);
      expect(result.poster[0]._id).toBe(_id);
      return;
    });
    // test the post twit functionality
    it('adds twit', async () => {
      const twitDb = makeTwiteeDb({ collectionName: 'twits' });
      // ====================
      const fakeUser = makeFakeUser({
        _id: undefined,
      });
      const auth = await axios.post('/user/signup', fakeUser);
      const {
        data: {
          token,
          user: { _id },
        },
      } = auth.data;
      // =====================
      const response = await axios({
        method: 'post',
        url: '/twit/post-twit',
        data: makeFakeTwit({
          _id: undefined,
          userId: undefined,
          text: 'this is testing.',
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${token}`,
        },
      });
      expect(response.status).toBe(201);
      const { data: twit } = response.data;
      const doc = await twitDb.findById(twit._id);
      expect(doc.userId).toBe(_id);
      expect(doc.text).toBe('this is testing.');
      expect(twit.hash).toBeDefined();
      expect(twit.createdOn).toBeDefined();
      expect(twit.modifiedOn).toBeDefined();
      return twitDb.remove(doc);
    });
    // test the like twit functionality
    it('like twit', async () => {
      // insert a test twit
      const fakeTwit = makeFakeTwit();
      const db = await makeDb();
      await db.collection('twits').insert(fakeTwit);
      // ====================
      const fakeUser = makeFakeUser({
        _id: undefined,
      });
      const auth = await axios.post('/user/signup', fakeUser);
      const {
        data: {
          token,
          user: { _id },
        },
      } = auth.data;
      // =====================
      const response = await axios({
        method: 'get',
        url: '/twit/like-twit/' + fakeTwit._id,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${token}`,
        },
      });
      expect(response.status).toBe(201);
      const { data: like } = response.data;
      expect(like.userId).toBe(_id);
      expect(like.twitId).toBe(fakeTwit._id);
      expect(like._id).toBeDefined();
      expect(like.createdOn).toBeDefined();
      expect(like.modifiedOn).toBeDefined();
    });
    // test the unlike twit functionality
    it('unlike twit', async () => {
      // insert a test twit
      const fakeTwit = makeFakeTwit();
      const db = await makeDb();
      await db.collection('twits').insert(fakeTwit);
      // ====================
      const fakeUser = makeFakeUser({
        _id: undefined,
      });
      const auth = await axios.post('/user/signup', fakeUser);
      const {
        data: { token },
      } = auth.data;
      // =====================
      // like the test twit
      const like = await axios({
        method: 'get',
        url: '/twit/like-twit/' + fakeTwit._id,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${token}`,
        },
      });
      const response = await axios({
        method: 'delete',
        url: '/twit/unlike-twit/' + fakeTwit._id,
        data: makeFakeTwit({
          _id: undefined,
          userId: undefined,
          text: 'this is testing.',
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${token}`,
        },
      });
      expect(response.status).toBe(201);
      const { data } = response.data;
      expect(data.unlike).toBe(true);
      expect(data._id).toBe(like.data.data._id);
    });
    // the unlike twit functionality => user should not be able to unlike twit that as not been liked be them
    it('user can not unlike twit that was not liked by them', async () => {
      // insert a test twit
      const fakeTwit = makeFakeTwit();
      const db = await makeDb();
      await db.collection('twits').insert(fakeTwit);
      // ====================
      const fakeUser = makeFakeUser({
        _id: undefined,
      });
      const auth = await axios.post('/user/signup', fakeUser);
      const {
        data: { token },
      } = auth.data;
      // =====================
      const response = await axios({
        method: 'delete',
        url: '/twit/unlike-twit/' + fakeTwit._id,
        data: makeFakeTwit({
          _id: undefined,
          userId: undefined,
          text: 'this is testing.',
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${token}`,
        },
      });
      expect(response.status).toBe(400);
      const { error, status } = response.data;
      expect(error).toBe('You did not liked this twit');
      expect(status).toBe('error');
    });
    //test the delete twit functionality
    it('deletes twit', async () => {
      const twitDb = makeTwiteeDb({ collectionName: 'twits' });
      // ====================
      const fakeUser = makeFakeUser({
        _id: undefined,
      });
      const auth = await axios.post('/user/signup', fakeUser);
      const {
        data: {
          token,
          user: { _id },
        },
      } = auth.data;
      // =====================
      const twit = makeFakeTwit({ userId: _id });
      await twitDb.insert(twit);
      const response = await axios({
        method: 'delete',
        url: '/twit/delete-twit/' + twit._id,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${token}`,
        },
      });
      expect(response.data.data._id).toBe(twit._id);
      expect(response.data.data.deleted).toBe(true);
    });
    // test delete functionality => user can not delete post that was not posted by them
    it('can not delete twit not posted by you', async () => {
      const twitDb = makeTwiteeDb({ collectionName: 'twits' });
      const twit = makeFakeTwit();
      await twitDb.insert(twit);
      // ====================
      const fakeUser = makeFakeUser({
        _id: undefined,
      });
      const auth = await axios.post('/user/signup', fakeUser);
      const {
        data: { token },
      } = auth.data;
      // =====================
      const response = await axios({
        method: 'delete',
        url: '/twit/delete-twit/' + twit._id,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${token}`,
        },
      });
      expect(response.data.status).toBe('error');
      expect(response.data.error).toBe('This twit was not posted by you');
    });
  });
});
