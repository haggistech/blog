import nc from 'next-connect';
import { all } from '@/middlewares/index';
import { editPost, getPosts, insertPost, getComments } from '@/db/index';

const handler = nc();

handler.use(all);

const maxAge = 1 * 24 * 60 * 60;

handler.get(async (req, res) => {
  const posts = await getPosts(
    req.db,
    req.query.from ? new Date(req.query.from) : undefined,
    req.query.by,
    req.query.limit ? parseInt(req.query.limit, 10) : undefined,
  );

  if (req.query.from && posts.length > 0) {
    // This is safe to cache because from defines
    //  a concrete range of posts
    res.setHeader('cache-control', `public, max-age=${maxAge}`);
    return null;
  }

  res.send({ posts });
  return posts;
});

handler.patch(async (req, res) => {
  if (!req.user) {
    return res.status(401).send('unauthenticated');
  }

  if (!req.body.content) return res.status(400).send('You must write something');

  const post = await editPost(req.db, {
    content: req.body.content,
    postId: req.body.postId,
  });

  return res.json({ post });
});

handler.post(async (req, res) => {
  if (!req.user) {
    return res.status(401).send('unauthenticated');
  }

  if (!req.body.content) return res.status(400).send('You must write something');
  if (!req.body.title) return res.status(400).send('You must have a title');

  const post = await insertPost(req.db, {
    title: req.body.title,
    content: req.body.content,
    creatorId: req.user._id,
  });

  return res.json({ post });
});

handler.get(async (req, res) => {
  const posts = await getComments(
    req.db,
    req.query.from ? new Date(req.query.from) : undefined,
    req.query.by,
    req.query.limit ? parseInt(req.query.limit, 10) : undefined,
  );

  if (req.query.from && comments.length > 0) {
    // This is safe to cache because from defines
    //  a concrete range of posts
    res.setHeader('cache-control', `public, max-age=${maxAge}`);
  }

  res.send({ comments });
});

export default handler;
