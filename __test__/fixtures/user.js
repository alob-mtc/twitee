import faker from 'faker';
import cuid from 'cuid';

const Id = Object.freeze({
  makeId: cuid,
  isValidId: cuid.isCuid,
});

export default function makeFakeUser(overrides) {
  const user = {
    _id: Id.makeId(),
    email: faker.internet.email(),
    name: faker.name.findName(),
    password: faker.lorem.word(),
    createdOn: Date.now(),
    modifiedOn: Date.now(),
  };

  return {
    ...user,
    ...overrides,
  };
}
