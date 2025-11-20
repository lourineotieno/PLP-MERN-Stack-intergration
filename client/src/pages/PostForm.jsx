import React, { useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function PostForm({ existing }) {
  const [title, setTitle] = useState(existing?.title || '');
  const [body, setBody] = useState(existing?.body || '');
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', title);
    fd.append('body', body);
    if (file) fd.append('featuredImage', file);

    try {
      const res = existing ? await API.put(`/posts/${existing._id}`, fd) : await API.post('/posts', fd);
      navigate(`/posts/${res.data._id}`);
    } catch (err) {
      console.error(err);
      alert('Error: ' + err?.response?.data?.message || err.message);
    }
  };

  return (
    <form onSubmit={submit}>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
      <textarea value={body} onChange={e => setBody(e.target.value)} />
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button type="submit">Save</button>
    </form>
  );
}
