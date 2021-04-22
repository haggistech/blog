import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Error from 'next/error';
import { all } from '@/middlewares/index';
import { useCurrentUser } from '@/hooks/index';
import Posts from '@/components/post/posts';
import { extractUser } from '@/lib/api-helpers';
import { findUserById } from '@/db/index';
import { defaultProfilePicture } from '@/lib/default';
import { findPostById } from '@/db/index';
import { useUser } from '@/hooks/index';

export default function PostPage({ post, }) {
  if (!post) return <Error statusCode={404} />;
  const { title, content, _id } = post || {};
  const user = useUser(post.creatorId);
  const [currentUser] = useCurrentUser();
  const isCurrentUser = currentUser?._id === post.creatorId;
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
          img {
            width: 10rem;
            height: auto;
            border-radius: 50%;
            box-shadow: rgba(0, 0, 0, 0.05) 0 10px 20px 1px;
            margin-right: 1.5rem;
            background-color: #f3f3f3;
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
          small {
            color: #777;
          }
        `}
      </style>
      <Head>
        <title>{title}</title>
      </Head>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <section>

            <h2>{title}</h2>

          <p>{content}</p>
          <p>Posted {new Date(post.createdAt).toLocaleString()} by {user.name}</p>
        </section>
      </div>

      <div id="comment" style={{ display: 'flex', alignItems: 'center' }}>
        <section>

          <p>Comment 1</p>
          <p>Posted {new Date(post.createdAt).toLocaleString()}</p>
        </section>
      </div>
      <div id="comment" style={{ display: 'flex', alignItems: 'center' }}>
        <section>

          <p>Comment 2</p>
          <p>Posted {new Date(post.createdAt).toLocaleString()}</p>
        </section>
      </div>
      <div id="comment" style={{ display: 'flex', alignItems: 'center' }}>
        <section>

          <p>Comment 3</p>
          <p>Posted {new Date(post.createdAt).toLocaleString()}</p>
        </section>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  await all.run(context.req, context.res);
  const post = await findPostById(context.req.db, context.params.postId);
  
  if (!post) context.res.statusCode = 404;
  return { props: { post } };
}
