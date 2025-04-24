import './App.css';
import React, { useState, useEffect } from 'react';
import { useRoutes, Link } from 'react-router-dom';
import { supabase } from './Client';

import TopNav from './components/TopNav';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import PostDetails from './pages/PostDetails';
import Card from './components/Card';

const App = () => {
  const [posts, setPosts] = useState([]);
  
  // Fetch posts from the database when component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('Posts')
        .select()
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Error fetching posts:", error);
      } else {
        setPosts(data || []);
      }
    };
    
    fetchPosts();
  }, []);

  const HomePage = () => (
    <div className="home-container">
      <div className="forum-header">
        <h1>Welcome to UIC's Forum</h1>
        <p>Join the conversation, share your thoughts, and connect with others.</p>
      </div>
      <div className="posts-container">
        {posts && posts.length > 0 ? (
          <div className="posts-grid">
            {posts.map((post) => (
              <Card 
                id={post.id} 
                title={post.title} 
                description={post.description} 
                image={post.image} 
                likes={post.likes}
                key={post.id}
              />
            ))}
          </div>
        ) : (
          <div className="no-posts-message">
            <h2>No discussions yet. Be the first to start one!</h2>
          </div>
        )}
      </div>
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
      element: <PostDetails data={posts} />
    },
    {
      path: "/edit/:id",
      element: <EditPost data={posts} />
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