import faker from 'faker';
import cuid from 'cuid';
import crypto from 'crypto';

const Id = Object.freeze({
  makeId: cuid,
  isValidId: cuid.isCuid,
});

function md5(text) {
  return crypto.createHash('md5').update(text, 'utf-8').digest('hex');
}

export default function makeFakeTwit(overrides) {
  const twit = {
    userId: Id.makeId(),
    createdOn: Date.now(),
    _id: Id.makeId(),
    modifiedOn: Date.now(),
    text: faker.lorem.paragraph(3),
  };
  twit.hash = md5(twit.text + (twit.userId || '') + (twit.twitId || ''));

  return {
    ...twit,
    ...overrides,
  };
}
