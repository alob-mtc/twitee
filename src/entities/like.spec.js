import makeFakeLike from '../../__test__/fixtures/like';
import Entities from '.';
const { makeLike } = Entities;
// !Like test
describe('like', () => {
  it('must have an author', () => {
    const comment = makeFakeLike({ userId: null });
    expect(() => makeLike(comment)).toThrow('Like must have a userId.');
  });

  it('must have a valid twit id', () => {
    const comment = makeFakeLike({ twitId: null });
    expect(() => makeLike(comment)).toThrow('Like must contain a twitId.');
  });
  it('can have an id', () => {
    const comment = makeFakeLike({ _id: 'invalid' });
    expect(() => makeLike(comment)).toThrow('Like must have a valid id.');
    const noId = makeFakeLike({ id: undefined });
    expect(() => makeLike(noId)).not.toThrow();
  });
  it('can create an id', () => {
    const noId = makeFakeLike({ _id: undefined });
    const comment = makeLike(noId);
    expect(comment.getId()).toBeDefined();
  });
  it('is createdOn now in UTC', () => {
    const noCreationDate = makeFakeLike({ createdOn: undefined });
    expect(noCreationDate.createdOn).not.toBeDefined();
    const d = makeLike(noCreationDate).getCreatedOn();
    expect(d).toBeDefined();
    expect(new Date(d).toUTCString().substring(26)).toBe('GMT');
  });
  it('is modifiedOn now in UTC', () => {
    const noModifiedOnDate = makeFakeLike({ modifiedOn: undefined });
    expect(noModifiedOnDate.modifiedOn).not.toBeDefined();
    const d = makeLike(noModifiedOnDate).getCreatedOn();
    expect(d).toBeDefined();
    expect(new Date(d).toUTCString().substring(26)).toBe('GMT');
  });
});
