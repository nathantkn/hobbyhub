import './App.css';
import React from 'react';
import { useRoutes } from 'react-router-dom';

import TopNav from './components/TopNav';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import PostDetails from './pages/PostDetails';
import ReadPosts from './pages/ReadPosts';

const App = () => {

  const HomePage = () => (
    <div className="home-container">
      <div className="forum-header">
        <h1>Welcome to UIC's Forum</h1>
        <p>Join the conversation, share your thoughts, and connect with others.</p>
      </div>
      <ReadPosts />
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

  return ( 
    <div className="App">
      <TopNav />
      <div className="content-container">
        {element}
      </div>
    </div>
  );
}

export default App;