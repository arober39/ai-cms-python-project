import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

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

  useEffect(() => {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const foundPost = posts.find((p: Post) => p.id === Number(id));
    if (foundPost) {
      setPost(foundPost);
      setContent(foundPost.content);
    }
  }, [id]);

  const handleUpdate = () => {
    if (!post) return;

    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const updatedPosts = posts.map((p: Post) =>
      p.id === post.id ? { ...p, content } : p
    );
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
    alert('Post updated!');
    navigate(`/posts/${post.id}`);
  };

  if (!post) return <p>Loading...</p>;

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
