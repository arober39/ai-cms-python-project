import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import api from '../api/axios';

type Post = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
};

const EditPost: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState<Post | null>(null);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/posts/${id}`);
        setPost(response.data);
        setContent(response.data.content);
      } catch (err) {
        console.error('Failed to fetch post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleUpdate = async () => {
    if (!post) return;

    const updatedPost = {
      ...post,
      content,
    };

    try {
      await api.put(`/posts/${post.id}`, updatedPost);
      alert('Post updated!');
      navigate(`/posts/${post.id}`);
    } catch (err) {
      console.error('Failed to update post:', err);
      alert('Error updating post.');
    }
  };

  if (loading) return <p>Loading post...</p>;
  if (!post) return <p>Post not found.</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Editing: {post.title}</h2>
      <CKEditor
        editor={ClassicEditor as any}
        data={content}
        onChange={(_, editor) => setContent(editor.getData())}
      />
      <button
        onClick={handleUpdate}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Save Changes
      </button>
    </div>
  );
};

export default EditPost;
