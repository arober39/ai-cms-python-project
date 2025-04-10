import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

type Post = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
};

const ViewPost: React.FC = () => {
  // const { id } = useParams();
  // const posts = JSON.parse(localStorage.getItem('posts') || '[]');
  // const post: Post | undefined = posts.find((p: Post) => p.id === Number(id));
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/posts/${id}`);
        setPost(response.data);
      } catch (err) {
        console.error('Failed to fetch post:', err);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <p>Loading post...</p>;
  if (!post) return <p>Post not found.</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
      <p className="text-sm text-gray-500">Published: {new Date(post.createdAt).toLocaleString()}</p>
      <div className="mt-4" dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
};

export default ViewPost;
