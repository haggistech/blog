import { nanoid } from 'nanoid';

export async function getComments(db, from = new Date(), by, limit) {
  return db
    .collection('comments')
    .find({
      ...(by && { postId: by }),
    })
    .sort({ CommentCreated: -1 })
    .limit(limit || 10)
    .toArray();
}

export async function insertComment(db, { title, content, creatorId }) {
  return db.collection('posts').insertOne({
    _id: nanoid(12),
    title,
    content,
    creatorId,
    createdAt: new Date(),
  }).then(({ ops }) => ops[0]);
}


export async function findCommentById(db, postId) {
  return db.collection('posts').findOne({
    _id: postId,
  }).then((post) => post || null);
}
