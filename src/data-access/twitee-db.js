export default function buildMakeTwiteeDb({ makeDb }) {
  return function makeTwiteeDb({ collectionName }) {
    return Object.freeze({
      find,
      findByHash,
      findById,
      findByTwitId,
      findByEmail,
      findByUserId,
      findTwit,
      insert,
      remove,
      update,
    });
    async function find(query) {
      const db = await makeDb();
      const result = await db.collection(collectionName).find(query);
      const found = await result.toArray();
      return found;
    }
    // this fetch a document by id
    async function findById(_id) {
      const db = await makeDb();
      const result = await db.collection(collectionName).find({ _id });
      const found = await result.toArray();
      if (found.length === 0) {
        return null;
      }
      return found[0];
    }
    // this fetch document by twitId
    async function findByTwitId(twitId) {
      const db = await makeDb();
      const query = { twitId };
      const result = await db.collection(collectionName).find(query);
      return await result.toArray();
    }
    // this fetch document by email
    async function findByEmail(email) {
      const db = await makeDb();
      const query = { email };
      const result = await db.collection(collectionName).find(query);
      return (await result.toArray())[0];
    }
    // this fetch document by UserId
    async function findByUserId(userId) {
      const db = await makeDb();
      const query = { userId };
      const result = await db.collection(collectionName).find(query);
      return await result.toArray();
    }
    // this is an aggregation pipeline that fetches the twits with all its comment and likes count and the poster
    async function findTwit() {
      const db = await makeDb();
      const result = await db.collection('twits').aggregate([
        {
          $lookup: {
            from: 'comments',
            as: 'comment',
            localField: '_id',
            foreignField: 'twitId',
          },
        },
        {
          $lookup: {
            from: 'users',
            as: 'poster',
            localField: 'userId',
            foreignField: '_id',
          },
        },
        {
          $lookup: {
            from: 'likes',
            as: 'likes',
            localField: '_id',
            foreignField: 'twitId',
          },
        },
      ]);
      return await result.toArray();
    }
    // this fetch document by hash
    async function findByHash(hash) {
      const db = await makeDb();
      const result = await db.collection(collectionName).find({ hash });
      const found = await result.toArray();
      if (found.length === 0) {
        return null;
      }
      return found[0];
    }
    // this insert document
    async function insert(dataInfo) {
      const db = await makeDb();
      const result = await db.collection(collectionName).insertOne(dataInfo);
      return result.ops[0];
    }
    // this update document
    async function update({ _id, ...dataInfo }) {
      const db = await makeDb();
      const result = await db
        .collection(collectionName)
        .updateOne({ _id }, { $set: { ...dataInfo } });
      return result.modifiedCount > 0 ? { _id, ...dataInfo } : null;
    }
    // this remove document from collection
    async function remove({ _id }) {
      const db = await makeDb();
      const result = await db.collection(collectionName).deleteOne({ _id });
      return result.deletedCount === 1;
    }
  };
}
