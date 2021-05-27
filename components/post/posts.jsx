import React, { useState } from 'react';
import { useSWRInfinite } from "swr";
import Link from "next/link";
import { useUser } from "@/hooks/index";
import fetcher from "@/lib/fetch";
import { useCurrentUser } from '@/hooks/index';
import { defaultProfilePicture } from '@/lib/default';
import PostEditor from './editor';

function Post({ post }) {
  const [edit, setEdit] = useState(false);
  const [content, setContent] = useState(post.content);
  const [msg, setMsg] = useState('');
  const user = useUser(post.creatorId);
  const [currUser] = useCurrentUser();
  const makeEdit = (msg, text) => {
    setEdit(false);
    setMsg(msg);
    setTimeout(() => setMsg(null), 1500);
    if (text) setContent(text);
  };
  return (
    <>
      <style jsx>
        {`
          #post {
            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.12);
            padding: 1.5rem;
            margin-bottom: 0.5rem;
            transition: box-shadow 0.2s ease 0s;
          }
          #card:hover {
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
          }
          small {
            color: #777;
          }
          /* Header/Blog Title */
          #header {
            padding: 30px;
            font-size: 40px;
            text-align: center;
            background: white;
          }
          /* Fake image */
          #fakeimg {
            background-colour: #f1f1f1
            height:200px;
            width: 100%;
            box-sizing: border-box;
            padding-bottom: 20px;
          }

          /* Add a card effect for articles */
          #card {
            background-color: white;
            padding: 10px;
            margin-top: 10px;
            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.12);
            transition: box-shadow 0.2s ease 0s;
            width: 100%;
            box-sizing: border-box;
          }
          #content {
            padding-left: 10px;
            padding-right: 10px;
            width: 100%;
            box-sizing: border-box;
          }

          /* Clear floats after the columns */
          #row:after {
            content: "";
            display: table;
            clear: both;
          }
        `}
      </style>
      <div id="card">
        
      <p style={{ color: '#0070f3', textAlign: 'center' }}>{msg}</p>
        <h2>{" "}
              <Link href={`/post/${post._id}`}>
                <a
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    color: "black",
                  }}
                >
                  <b>{post.title}<br /><br /></b>
                </a>
              </Link></h2>
        <h5>             {" "}
              <small>
                {new Date(post.createdAt).toLocaleString("en-GB", {
                  timeZone: "Europe/London",
                })}{" "}
                -{" "}
                <span role="img" aria-label="Edit" onClick={() => {
              setEdit(!edit);
            }}>>
                  📝
                </span>{" "}
                - Posted By:{" "}
              </small>
              {user && (
                <Link href={`/user/${user._id}`}>
                  <a
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      color: "black",
                    }}
                  >
                    <small>{user.name}</small>
                  </a>
                </Link>
              )}
              {user && (
                <Link href={`/comments/${user._id}`}>
                  <a
                    style={{
                      display: "inline",
                      align: "right",
                      color: "black",
                    }}
                  >
                    &nbsp; - <small>Comments(0)</small>
                  </a>
                </Link>
              )}</h5>
        <div>
          <img id="fakeimg" src={post.postImage} />
        </div>
        {edit === true ? (
          <PostEditor edit={edit} makeEdit={makeEdit} text={content} Id={post._id} />
        ) : (
        <p id="content">{post.content}</p>
        )}

      </div>
      <br />
      <br />
    </>
  );
}

const PAGE_SIZE = 10;

export function usePostPages({ creatorId } = {}) {
  return useSWRInfinite(
    (index, previousPageData) => {
      // reached the end
      if (previousPageData && previousPageData.posts.length === 0) return null;

      // first page, previousPageData is null
      if (index === 0) {
        return `/api/posts?limit=${PAGE_SIZE}${
          creatorId ? `&by=${creatorId}` : ""
        }`;
      }

      // using oldest posts createdAt date as cursor
      // We want to fetch posts which has a datethat is
      // before (hence the .getTime() - 1) the last post's createdAt
      const from = new Date(
        new Date(
          previousPageData.posts[previousPageData.posts.length - 1].createdAt
        ).getTime() - 1
      ).toJSON();

      return `/api/posts?from=${from}&limit=${PAGE_SIZE}${
        creatorId ? `&by=${creatorId}` : ""
      }`;
    },
    fetcher,
    {
      refreshInterval: 10000, // Refresh every 10 seconds
    }
  );
}

export function useCommentPages({ postId } = {}) {
  return useSWRInfinite(
    (index, previousPageData) => {
      // reached the end
      if (previousPageData && previousPageData.comments.length === 0)
        return null;

      // first page, previousPageData is null
      if (index === 0) {
        return `/api/comments?limit=${PAGE_SIZE}${
          postId ? `&by=${postId}` : ""
        }`;
      }

      // using oldest posts createdAt date as cursor
      // We want to fetch posts which has a datethat is
      // before (hence the .getTime() - 1) the last post's createdAt
      const from = new Date(
        new Date(
          previousPageData.comments[
            previousPageData.comments.length - 1
          ].CommentCreated
        ).getTime() - 1
      ).toJSON();

      return `/api/comments?from=${from}&limit=${PAGE_SIZE}${
        postId ? `&by=${postId}` : ""
      }`;
    },
    fetcher,
    {
      refreshInterval: 10000, // Refresh every 10 seconds
    }
  );
}

export default function Posts({ creatorId }) {
  const { data, error, size, setSize } = usePostPages({ creatorId });

  const posts = data
    ? data.reduce((acc, val) => [...acc, ...val.posts], [])
    : [];
  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData || (data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0].posts?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.posts.length < PAGE_SIZE);

  return (
    <div>
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
      {!isReachingEnd && (
        <button
          type="button"
          style={{
            background: "transparent",
            color: "#000",
          }}
          onClick={() => setSize(size + 1)}
          disabled={isReachingEnd || isLoadingMore}
        >
          {isLoadingMore ? ". . ." : "load more"}
        </button>
      )}
    </div>
  );
}

export function Comments({ postId }) {
  const { data, error, size, setSize } = usePostPages({ postId });

  const comments = data
    ? data.reduce((acc, val) => [...acc, ...val.comments], [])
    : [];
  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData || (data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0].comments?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.comments.length < PAGE_SIZE);

  return (
    <div>
      {comments.map((comment) => (
        <Post key={comment._id} comment={comment} />
      ))}
      {!isReachingEnd && (
        <button
          type="button"
          style={{
            background: "transparent",
            color: "#000",
          }}
          onClick={() => setSize(size + 1)}
          disabled={isReachingEnd || isLoadingMore}
        >
          {isLoadingMore ? ". . ." : "load more"}
        </button>
      )}
    </div>
  );
}
