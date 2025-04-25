import './App.css';
import React, { useState, useEffect } from 'react';
import { useRoutes, useNavigate, useSearchParams, useLocation } from 'react-router-dom';

import TopNav from './components/TopNav';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import PostDetails from './pages/PostDetails';
import ReadPosts from './pages/ReadPosts';

const App = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const location = useLocation();

  // Initialize search from URL params if available
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [searchParams]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Update URL if needed but don't navigate (to avoid page refreshes)
    if (window.location.pathname === '/') {
      navigate(`/?search=${encodeURIComponent(query)}`, { replace: true });
    }
  };

  const handleSort = (sortOption) => {
    setSortBy(sortOption);
  };

  const HomePage = () => (
    <div className="home-container">
      <div className="forum-header">
        <h1>Welcome to UIC's Forum</h1>
        <p>Join the conversation, share your thoughts, and connect with others.</p>
      </div>
      <ReadPosts searchQuery={searchQuery} sortBy={sortBy} />
    </div>
  );

  // Sets up routes
  let element = useRoutes([
    {
      path: "/",
      element: <HomePage />
    },
    {
      path: "/post/:id",
      element: <PostDetails />
    },
    {
      path: "/edit/:id",
      element: <EditPost />
    },
    {
      path: "/new",
      element: <CreatePost />
    }
  ]);

  // Check if current path is the home page
  const isHomePage = location.pathname === '/';

  return ( 
    <div className="App">
      {isHomePage && <TopNav onSearch={handleSearch} onSort={handleSort} />}
      <div className="content-container">
        {element}
      </div>
    </div>
  );
}

export default App;