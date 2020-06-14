import makeFakeTwit from '../../__test__/fixtures/twit';
import Entities from '.';
const { makeTwit } = Entities;
import { md5 } from '.';
// !twit test
describe('twit', () => {
  it('must have an author', () => {
    const twit = makeFakeTwit({ userId: null });
    expect(() => makeTwit(twit)).toThrow('Twit must have an author.');
  });
  it('must have valid text', () => {
    const twit = makeFakeTwit({ text: null });
    expect(() => makeTwit(twit)).toThrow(
      'Twit must include at least one character of text.',
    );
  });
  it('can have an id', () => {
    const twit = makeFakeTwit({ _id: 'invalid' });
    expect(() => makeTwit(twit)).toThrow('Twit must have a valid id.');
    const noId = makeFakeTwit({ _id: undefined });
    expect(() => makeTwit(noId)).not.toThrow();
  });
  it('can create an id', () => {
    const noId = makeFakeTwit({ _id: undefined });
    const twit = makeTwit(noId);
    expect(twit.getId()).toBeDefined();
  });
  it('is createdOn now in UTC', () => {
    const noCreationDate = makeFakeTwit({ createdOn: undefined });
    expect(noCreationDate.createdOn).not.toBeDefined();
    const d = makeTwit(noCreationDate).getCreatedOn();
    expect(d).toBeDefined();
    expect(new Date(d).toUTCString().substring(26)).toBe('GMT');
  });
  it('is modifiedOn now in UTC', () => {
    const noModifiedOnDate = makeFakeTwit({ modifiedOn: undefined });
    expect(noModifiedOnDate.modifiedOn).not.toBeDefined();
    const d = makeTwit(noModifiedOnDate).getCreatedOn();
    expect(d).toBeDefined();
    expect(new Date(d).toUTCString().substring(26)).toBe('GMT');
  });
  it('sanitizes its text', () => {
    const good = makeTwit({
      ...makeFakeTwit({ text: '<p>This is fine</p>' }),
    });
    const bad = makeTwit({
      ...makeFakeTwit({
        text: '<script>This is not so fine</script><p>but this is ok</p>',
      }),
    });
    const totallyBad = makeFakeTwit({
      text: '<script>All your base are belong to us!</script>',
    });

    expect(good.getText()).toBe('<p>This is fine</p>');
    expect(bad.getText()).toBe('<p>but this is ok</p>');
    expect(() => makeTwit(totallyBad)).toThrow('Twit contains no usable text.');
  });
  it('includes a hash', () => {
    const fakeTwit = {
      userId: 'Bruce Wayne',
      text: "I'm batman.",
    };
    // md5 from: http://www.miraclesalad.com/webtools/md5.php
    expect(makeTwit(fakeTwit).getHash()).toBe(
      md5(fakeTwit.text + fakeTwit.userId),
    );
  });
});
