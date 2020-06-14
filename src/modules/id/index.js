const cuid = require('cuid');
// thw id generation object
const Id = Object.freeze({
  makeId: cuid,
  isValidId: cuid.isCuid,
});

module.exports = Id;
