import { nanoid } from 'nanoid';

export async function getPosts(db, from = new Date(), by, limit) {
  return db
    .collection('posts')
    .find({
      // Pagination: Fetch posts from before the input date or fetch from newest
      ...(from && {
        createdAt: {
          $lte: from,
        },
      }),
      ...(by && { creatorId: by }),
    })
    .sort({ createdAt: -1 })
    .limit(limit || 10)
    .toArray();
}

export async function editPost(db, { content, postId }) {
  return db
    .collection('posts')
    .findOneAndUpdate(
      { _id: postId },
      {
        $set: {
          content,
        },
      },
      { returnOriginal: false },
    )
    .then(({ value }) => value);
}


export async function insertPost(db, { title, content, creatorId }) {
  return db.collection('posts').insertOne({
    _id: nanoid(12),
    title,
    content,
    creatorId,
    createdAt: new Date(),
  }).then(({ ops }) => ops[0]);
}


export async function findPostById(db, postId) {
  return db.collection('posts').findOne({
    _id: postId,
  }).then((post) => post || null);
}
