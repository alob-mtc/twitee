// the db-interface
import buildMakeTwiteeDb from './twitee-db';
import makeDbTest from '../../__test__/fixtures/db';
import mongodb from 'mongodb';
// set up the mongodb database
const MongoClient = mongodb.MongoClient;
const url = process.env.DB_URL;
const dbName = process.env.DB_NAME;
const client = new MongoClient(url, { useNewUrlParser: true });
// the makeDb function => it is responsible for connectiing to the database instance
export async function makeDb() {
  if (!client.isConnected()) {
    await client.connect();
  }
  return client.db(dbName);
}
// the database interface factory
const makeTwiteeDb = buildMakeTwiteeDb({
  makeDb: process.env.NODE_ENV == 'test' ? makeDbTest : makeDb,
});
export default makeTwiteeDb;
