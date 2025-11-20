import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { useParams } from 'react-router-dom';

export default function PostView() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [text, setText] = useState('');

  useEffect(()=> {
    API.get(`/posts/${id}`).then(res => setPost(res.data));
  }, [id]);

  const addComment = async () => {
    await API.post(`/posts/${id}/comments`, { text });
    const res = await API.get(`/posts/${id}`);
    setPost(res.data);
    setText('');
  };

  if (!post) return <div>Loading...</div>;
  return (
    <div>
      <h1>{post.title}</h1>
      {post.featuredImage && <img src={post.featuredImage} alt='' style={{maxWidth:400}} />}
      <div dangerouslySetInnerHTML={{__html: post.body}} />
      <h4>Comments</h4>
      {post.comments.map(c => <div key={c._id}><b>{c.user?.name}</b>: {c.text}</div>)}
      <textarea value={text} onChange={e => setText(e.target.value)} />
      <button onClick={addComment}>Add comment</button>
    </div>
  );
}
