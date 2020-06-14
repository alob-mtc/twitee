import { makeDb } from '../src/data-access';
import dotenv from 'dotenv';
dotenv.config();
(async function setupDb() {
  console.log('Setting up database...');
  // database collection will automatically be created if it does not exist
  // indexes will only be added if they don't exist
  const db = await makeDb();
  const result = await Promise.all([
    db.collection('comments').createIndexes([
      { key: { hash: 1 }, name: 'hash_idx' },
      { key: { twitId: -1 }, name: 'postId_idx' },
      { key: { userId: -1 }, name: 'userId_idx' },
    ]),
    db
      .collection('users')
      .createIndexes([{ key: { email: -1 }, name: 'email_idx' }]),
    db.collection('twits').createIndexes([
      { key: { userId: -1 }, name: 'userId_idx' },
      { key: { hash: 1 }, name: 'hash_idx' },
    ]),
    db.collection('likes').createIndexes([
      { key: { twitId: -1 }, name: 'postId_idx' },
      { key: { userId: -1 }, name: 'userId_idx' },
    ]),
  ]);
  console.log(result);
  console.log('Database setup complete...');
  process.exit();
})();
