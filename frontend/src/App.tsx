import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import logo from './logo.svg';
import './App.css';
import RichTextEditor from './components/RichTextEditor';
import PostsList from './components/PostsList';
import ViewPost from './components/ViewPost';
import EditPost from './components/EditPost';

function App() {
  return (
    <Router>
      <div className="p-4">
        <nav className="mb-4 space-x-4">
          <Link to="/">New Post</Link>
          <Link to="/posts">All Posts</Link>
        </nav>
        <Routes>
          <Route path="/" element={<RichTextEditor />} />
          <Route path="/posts" element={<PostsList />} />
          <Route path="/posts/:id" element={<ViewPost />} />
          <Route path="/edit/:id" element={<EditPost />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
