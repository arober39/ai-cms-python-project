import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

type Post = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
};

const PostsList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/posts');
        setPosts(response.data);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this post?');
    if (!confirmed) return;

    try {
      await api.delete(`/posts/${id}`);
      setPosts(posts.filter(post => post.id !== id));
      alert('Post deleted!');
    } catch (err) {
      console.error('Failed to delete post:', err);
      alert('Error deleting post.');
    }
  };

  const sortedPosts = [...posts].sort((a, b) => {
    return sortOrder === 'newest'
      ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  const filteredPosts = sortedPosts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-xl font-bold mb-4">All Saved Posts</h2>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <label className="mr-2 font-medium">Sort by:</label>
          <select
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value as 'newest' | 'oldest')}
            className="border px-2 py-1 rounded"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        <input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="border px-4 py-2 rounded w-full sm:w-64"
        />
      </div>

      {filteredPosts.length === 0 ? (
        <p>No posts match your search.</p>
      ) : (
        <ul className="space-y-4">
          {filteredPosts.map(post => (
            <li key={post.id} className="border p-4 bg-white rounded shadow">
              <h3 className="text-lg font-semibold">{post.title}</h3>
              <p className="text-sm text-gray-500">
                Saved on: {new Date(post.createdAt).toLocaleString()}
              </p>
              <div className="mt-3 space-x-4">
                <Link
                  to={`/posts/${post.id}`}
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  View
                </Link>
                <Link
                  to={`/edit/${post.id}`}
                  className="text-green-600 underline hover:text-green-800"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-red-600 underline hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PostsList;
