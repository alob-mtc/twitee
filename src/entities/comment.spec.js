import makeFakeComment from '../../__test__/fixtures/comment';
import Entities from '.';
const { makeComment } = Entities;
import { md5 } from '.';
// !Comment test
describe('comment', () => {
  it('must have an author', () => {
    const comment = makeFakeComment({ userId: null });
    expect(() => makeComment(comment)).toThrow('Comment must have an author.');
  });

  it('must have a valid twit id', () => {
    const comment = makeFakeComment({ twitId: null });
    expect(() => makeComment(comment)).toThrow(
      'Comment must contain a twitId.',
    );
  });
  it('must have valid text', () => {
    const comment = makeFakeComment({ text: null });
    expect(() => makeComment(comment)).toThrow(
      'Comment must include at least one character of text.',
    );
  });
  it('can have an id', () => {
    const comment = makeFakeComment({ _id: 'invalid' });
    expect(() => makeComment(comment)).toThrow('Comment must have a valid id.');
    const noId = makeFakeComment({ _id: undefined });
    expect(() => makeComment(noId)).not.toThrow();
  });
  it('can create an id', () => {
    const noId = makeFakeComment({ _id: undefined });
    const comment = makeComment(noId);
    expect(comment.getId()).toBeDefined();
  });
  it('is createdOn now in UTC', () => {
    const noCreationDate = makeFakeComment({ createdOn: undefined });
    expect(noCreationDate.createdOn).not.toBeDefined();
    const d = makeComment(noCreationDate).getCreatedOn();
    expect(d).toBeDefined();
    expect(new Date(d).toUTCString().substring(26)).toBe('GMT');
  });
  it('is modifiedOn now in UTC', () => {
    const noModifiedOnDate = makeFakeComment({ modifiedOn: undefined });
    expect(noModifiedOnDate.modifiedOn).not.toBeDefined();
    const d = makeComment(noModifiedOnDate).getCreatedOn();
    expect(d).toBeDefined();
    expect(new Date(d).toUTCString().substring(26)).toBe('GMT');
  });
  it('sanitizes its text', () => {
    const good = makeComment({
      ...makeFakeComment({ text: '<p>This is fine</p>' }),
    });
    const bad = makeComment({
      ...makeFakeComment({
        text: '<script>This is not so fine</script><p>but this is ok</p>',
      }),
    });
    const totallyBad = makeFakeComment({
      text: '<script>All your base are belong to us!</script>',
    });

    expect(good.getText()).toBe('<p>This is fine</p>');
    expect(bad.getText()).toBe('<p>but this is ok</p>');
    expect(() => makeComment(totallyBad)).toThrow(
      'Comment contains no usable text.',
    );
  });
  it('includes a hash', () => {
    const fakeComment = {
      userId: 'Bruce Wayne',
      text: "I'm batman.",
      twitId: 'cjt65art5350vy000hm1rp3s9',
    };
    // md5 from: http://www.miraclesalad.com/webtools/md5.php
    expect(makeComment(fakeComment).getHash()).toBe(
      md5(fakeComment.text + fakeComment.userId + fakeComment.twitId),
    );
  });
});
