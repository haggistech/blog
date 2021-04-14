import React from 'react';
import { useCurrentUser } from '@/hooks/index';
import PostEditor from '@/components/post/editor';
import Posts from '@/components/post/posts';

const IndexPage = () => {
  const [user] = useCurrentUser();

  return (
    <>
      <style jsx>
        {`
          p {
            text-align: center;
            color: #888;
          }
          h3 {
            color: #555;
          }
        `}
      </style>
      <div style={{ marginBottom: '2rem' }}>
        <h2>
          Hello,
          {' '}
          {user ? user.name : 'There'}
          !
        </h2>
        <p>Welcome to Miks App</p>
      </div>
      <div>
        <h3>
          All Posts....
        </h3>
        <PostEditor />
        <Posts />
      </div>
    </>
  );
};

export default IndexPage;
