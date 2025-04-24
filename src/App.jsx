import './App.css';
import React, { useState, useEffect } from 'react';
import { useRoutes, Link } from 'react-router-dom'
import { supabase } from './Client'

import SideNav from './components/SideNav'
import CreatePost from './pages/CreatePost'
import EditPost from './pages/EditPost'
import PostDetails from './pages/PostDetails'
import Gallery from './pages/Gallery';

const App = () => {
  const [posts, setPosts] = useState([]);
  
  // Fetch posts from the database when component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('Posts')
        .select();
        
      if (error) {
        console.error("Error fetching posts:", error);
      } else {
        setPosts(data || []);
      }
    };
    
    fetchPosts();
  }, []);

  const HomePage = () => (
    <div>
      <div className="header">
        <h1>Welcome to Party Animals!</h1>
      </div>
      {/* <img src={} className="hero-image" /> */}
      <div className="app-description">
        <h2>Discover Extraordinary Animals with Superpowers</h2>
        <p>Party Animals is a fun place to explore and create your own collection of amazing animals, each with their unique superpowers!</p>
        <p>Visit our Gallery to see all the incredible animals, or create your own powerful companion.</p>
        <Link to="/gallery"><button className="gallery-button">Explore the Gallery</button></Link>
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
      path: "/gallery",
      element: <Gallery data={posts} />
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
      <SideNav />
      <div className="content-container">
        {element}
      </div>
    </div>
  );
}

export default App;