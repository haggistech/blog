import React from "react";
import { useSWRInfinite } from "swr";
import Link from "next/link";
import { useUser } from "@/hooks/index";
import fetcher from "@/lib/fetch";
import { defaultProfilePicture } from "@/lib/default";

function Post({ post }) {
  const user = useUser(post.creatorId);
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
          #post:hover {
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
          }
          small {
            color: #777;
          }
          .parent {
            display: grid;
            grid-template-columns: repeat(5, 2fr);
            grid-template-rows: repeat(5, 2fr);
            grid-column-gap: 0px;
            grid-row-gap: 10px;
          }

          #div1 {
            grid-area: 1 / 1 / 4 / 4;
          }
          #div2 {
            grid-area: 1 / 1 / 2 / 4;

          }
          #div3 {
            grid-area: 2 / 1 / 3 / 2;
            float: left;
            width: 40px;

          }
          #div4 {
            grid-area: 2 / 2 / 3 / 4;
            float: right;
            width: 100%;
          }
          #div5 {
            grid-area: 3 / 1 / 4 / 4;
          }
        `}
      </style>
      <div id="post">
        <div id="parent">
          <div id="div1">
            <div id="div2">
              {" "}
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
              </Link>
            </div>
            <div id="div3">
            </div>
            <div id="div4">{post.content}<br /><br /></div>
            <div id="div5">
              {" "}
              <small>
                {new Date(post.createdAt).toLocaleString("en-GB", {
                  timeZone: "Europe/London",
                })}{" "}
                -{" "}
                <span role="img" aria-label="Edit">
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
                    <small>{user.name} </small>
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
              )}
            </div>
          </div>
        </div>
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
      if (previousPageData && previousPageData.comments.length === 0) return null;

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
          previousPageData.comments[previousPageData.comments.length - 1].CommentCreated
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