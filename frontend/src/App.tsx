import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import RichTextEditor from './components/RichTextEditor';
import PostsList from './components/PostsList';
import ViewPost from './components/ViewPost';
import EditPost from './components/EditPost';

const AppNav: React.FC = () => {
  const navigate = useNavigate();

  const handleNewPostClick = () => {
    sessionStorage.setItem('clearEditor', 'true');
    navigate('/new');
  };

  return (
    <nav className="mb-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-blue-700">Mini CMS</h1>
      <div className="space-x-4">
        <button onClick={handleNewPostClick} className="text-blue-600 hover:underline">
          New Post
        </button>
        <button onClick={() => navigate('/posts')} className="text-blue-600 hover:underline">
          All Posts
        </button>
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="p-4 max-w-5xl mx-auto">
        <AppNav />
        <Routes>
        <Route path="/" element={<PostsList />} />
          <Route path="/new" element={<RichTextEditor />} />
          <Route path="/posts" element={<PostsList />} />
          <Route path="/posts/:id" element={<ViewPost />} />
          <Route path="/edit/:id" element={<EditPost />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
