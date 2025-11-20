import React, { useContext, useEffect } from 'react';
import useApi from '../hooks/useApi';
import API from '../api/api';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export default function PostsList() {
  const { data, loading, error, refetch } = useApi('/posts', { page:1, limit:10 }, []);
  const { setPosts } = useContext(AppContext);

  useEffect(() => { if (data?.data) setPosts(data.data); }, [data]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {JSON.stringify(error)}</div>;

  return (
    <div>
      <h1>Posts</h1>
      {data?.data?.map(post => (
        <div key={post._id}>
          <Link to={`/posts/${post._id}`}><h3>{post.title}</h3></Link>
          <p>{post.body?.slice(0,150)}...</p>
        </div>
      ))}
      {/* pagination UI */}
      <div>
        Page {data?.page} of {data?.pages}
      </div>
    </div>
  );
}
