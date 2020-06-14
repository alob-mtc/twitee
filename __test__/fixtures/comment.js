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

export default function makeFakeComment(overrides) {
  const comment = {
    userId: Id.makeId(),
    createdOn: Date.now(),
    _id: Id.makeId(),
    modifiedOn: Date.now(),
    twitId: Id.makeId(),
    text: faker.lorem.paragraph(3),
  };
  comment.hash = md5(
    comment.text + (comment.userId || '') + (comment.twitId || ''),
  );

  return {
    ...comment,
    ...overrides,
  };
}
