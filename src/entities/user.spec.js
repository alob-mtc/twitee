import makeFakeUser from '../../__test__/fixtures/user';
import Entities from '.';
const { makeUser } = Entities;
import Hash from '../modules/hash';
const { generateHash, verifyHash } = Hash;

// !user test
describe('user', () => {
  it('must have an email', () => {
    const user = makeFakeUser({ email: null });
    expect(() => makeUser(user)).toThrow('user must have an email');
  });

  it('must have a name', () => {
    const user = makeFakeUser({ email: '@gmail.com' });
    expect(() => makeUser(user)).toThrow('user must have a name');
  });
  it('can have an id', () => {
    const user = makeFakeUser({ _id: 'invalid' });
    expect(() => makeUser(user)).toThrow('user must have a valid id.');
    const noId = makeFakeUser({ _id: undefined });
    expect(() => makeUser(noId)).not.toThrow();
  });
  it('can create an id', () => {
    const noId = makeFakeUser({ _id: undefined });
    const user = makeUser(noId);
    expect(user.getId()).toBeDefined();
  });
  it('must have a password', () => {
    const user = makeFakeUser({ password: null });
    expect(() => makeUser(user)).toThrow('user must have a password');
  });
  it('can encrypt passowrd', () => {
    const testPassword = 'password';
    const user = makeFakeUser({ password: testPassword });
    const newUser = makeUser(user);
    newUser.encryptPassword();
    expect(verifyHash(newUser.getPassword(), testPassword)).toBe(true);
  });
  it('can verify encrypt passowrd', () => {
    const testPassword = 'password';
    const user = makeFakeUser({ password: testPassword });
    const newUser = makeUser(user);
    newUser.encryptPassword();
    expect(newUser.validPassword(testPassword)).toBe(true);
  });
  it('is createdOn now in UTC', () => {
    const noCreationDate = makeFakeUser({ createdOn: undefined });
    expect(noCreationDate.createdOn).not.toBeDefined();
    const d = makeUser(noCreationDate).getCreatedOn();
    expect(d).toBeDefined();
    expect(new Date(d).toUTCString().substring(26)).toBe('GMT');
  });
  it('is modifiedOn now in UTC', () => {
    const noModifiedOnDate = makeFakeUser({ modifiedOn: undefined });
    expect(noModifiedOnDate.modifiedOn).not.toBeDefined();
    const d = makeUser(noModifiedOnDate).getCreatedOn();
    expect(d).toBeDefined();
    expect(new Date(d).toUTCString().substring(26)).toBe('GMT');
  });
});
