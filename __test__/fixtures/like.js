import cuid from 'cuid';

const Id = Object.freeze({
  makeId: cuid,
  isValidId: cuid.isCuid,
});

export default function makeFakeTwit(overrides) {
  const twit = {
    userId: Id.makeId(),
    createdOn: Date.now(),
    _id: Id.makeId(),
    modifiedOn: Date.now(),
    twitId: Id.makeId(),
  };

  return {
    ...twit,
    ...overrides,
  };
}
