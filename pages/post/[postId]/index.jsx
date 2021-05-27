import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Error from 'next/error';
import { all } from '@/middlewares/index';
import { useCurrentUser } from '@/hooks/index';
import Posts from '@/components/post/posts';
import { findPostById } from '@/db/index';
import { getComments } from '@/db/index';
import { useUser } from '@/hooks/index';

export default function PostPage({ post, comments}) {
  if (!post) return <Error statusCode={404} />;
  const { title, content, postImage, _id } = post || {};
  const { postId, creatorId, comment, CommentCreated } = comments || {};
  const user = useUser(post.creatorId);
  const [currentUser] = useCurrentUser();
  const isCurrentUser = currentUser?._id === post.creatorId;
  console.log({post});
  console.log({comments});
  return (
    <>
      <style jsx>
        {`
          h2 {
            text-align: left;
            margin-right: 0.5rem;
          }
          button {
            margin: 0 0.25rem;
          }

          div {
            color: #777;
          }
          p {
            font-family: monospace;
            color: #444;
            margin: 0.25rem 0 0.75rem;
          }
          a {
            margin-left: 0.25rem;
          }
          div {
            box-shadow: 0 5px 10px rgba(0,0,0,0.12);
            padding: 1.5rem;
            margin-bottom: 0.5rem;
            transition: box-shadow 0.2s ease 0s;
          }
          div:hover {
            box-shadow: 0 8px 30px rgba(0,0,0,0.12);
          }
          #comment {
            box-shadow: 0 5px 10px rgba(0,0,0,0.12);
            padding: 1.5rem;
            margin-bottom: 0.5rem;
            transition: box-shadow 0.2s ease 0s;
            width: 80%;
            float: right;
          }
          #hero {
            background-colour: #f1f1f1
            height:200px;
            width: 100%;
            box-sizing: border-box;
            padding-bottom: 20px;
          }
          }
          small {
            color: #777;
          }
          a {
            color: #777;
          }
        `}
      </style>
      <Head>
        <title>{title}</title>
      </Head>
      <Link href="/">
            <a>
            Return to Index
            </a>
          </Link>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <section>

          <img id="hero" src={post.postImage} />

            <h2>{title}</h2>

          <p>{content}</p>
          <p>Posted {new Date(post.createdAt).toLocaleString()} by </p>
        </section>
      </div>


          {comments.map((comment) =>
                <div id="comment" key="{comment._id}" style={{ display: 'flex', alignItems: 'center' }}>
                <section>
                <p>{comment.comment}</p>
                <p>Posted {new Date(comment.CommentCreated).toLocaleString()}</p>
        </section>
      </div>
          )}
          

    </>
  );
}

export async function getServerSideProps(context) {
  await all.run(context.req, context.res);
  const post = await findPostById(context.req.db, context.params.postId);
  const comments = await getComments(context.req.db, context.params.postId, post._id);
  if (!post) context.res.statusCode = 404;
  return { props: { post, comments } };
}

