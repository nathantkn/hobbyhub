import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../Client'

import Card from '../components/Card';
import '../styles/ReadPosts.css'

const ReadPosts = ({ searchQuery = '', sortBy = 'newest' }) => {
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [searchParams] = useSearchParams();

    // Fetch posts from the database
    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);

            const { data } = await supabase
                .from('Posts')
                .select()
                
            setPosts(data || []);
            setFilteredPosts(data || []);
            setLoading(false);
        };
        
        fetchPosts().catch(console.error);
    }, []);

    // Handle search params from URL
    useEffect(() => {
        const query = searchParams.get('search');
        if (query) {
            filterPosts(query, sortBy);
        }
    }, [searchParams, posts]);

    // Apply filtering and sorting when props change
    useEffect(() => {
        filterPosts(searchQuery, sortBy);
    }, [searchQuery, sortBy, posts]);

    // Filter posts based on search query and sort order
    const filterPosts = (query, sort) => {
        let filtered = [...posts];
        
        // Filter by search query if provided
        if (query && query.trim() !== '') {
            filtered = filtered.filter(post => 
                post.title.toLowerCase().includes(query.toLowerCase())
            );
        }
        
        // Sort posts based on selected sort option
        switch (sort) {
            case 'newest':
                filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                break;
            case 'oldest':
                filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                break;
            case 'most_likes':
                filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
                break;
            case 'least_likes':
                filtered.sort((a, b) => (a.likes || 0) - (b.likes || 0));
                break;
            default:
                filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }
        
        setFilteredPosts(filtered);
    };

    if (loading) {
        return <div className="post-details">Loading posts...</div>;
    }
    
    return (
        <div className="posts-container">
            {filteredPosts && filteredPosts.length > 0 ? (
                <div className="ReadPosts">
                    {filteredPosts.map((post) => (
                        <Card 
                            id={post.id} 
                            title={post.title} 
                            likes={post.likes}
                            created_at={post.created_at}
                            key={post.id}
                        />
                    ))}
                </div>
            ) : (
                <div className="no-posts-message">
                    {searchQuery ? (
                        <h2>No posts match your search. Try a different search term.</h2>
                    ) : (
                        <h2>No discussions yet. Be the first to start one!</h2>
                    )}
                </div>
            )}
        </div>
    );
}

export default ReadPosts;