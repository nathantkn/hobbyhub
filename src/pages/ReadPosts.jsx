import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../Client';

import Card from '../components/Card';
import Spinner from '../components/Spinner';
import '../styles/ReadPosts.css';

const ReadPosts = ({ searchQuery = '', sortBy = 'newest' }) => {
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [searchParams] = useSearchParams();
    const [isSearching, setIsSearching] = useState(false);

    // Fetch posts from the database
    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);

            const { data } = await supabase
                .from('Posts')
                .select();
                
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
        const applyFilters = async () => {
            setIsSearching(true);
            
            // Create a promise that resolves after 1 second
            const minDelay = new Promise(resolve => setTimeout(resolve, 1000));
            
            // Filter the posts
            const filteringTask = new Promise(resolve => {
                setTimeout(() => {
                    let filtered = [...posts];
                    
                    // Filter by search query if provided
                    if (searchQuery && searchQuery.trim() !== '') {
                        filtered = filtered.filter(post => 
                            post.title.toLowerCase().includes(searchQuery.toLowerCase())
                        );
                    }
                    
                    // Sort posts based on selected sort option
                    switch (sortBy) {
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
                    
                    resolve(filtered);
                }, 0);
            });
            
            // Wait for both the minimum delay and the filtering to complete
            const [filtered] = await Promise.all([filteringTask, minDelay]);
            
            setFilteredPosts(filtered);
            setIsSearching(false);
        };
        
        if (posts.length > 0) {
            applyFilters();
        }
    }, [searchQuery, sortBy, posts]);

    // Original filterPosts function - now only used for URL search params
    const filterPosts = (query, sort) => {
        setIsSearching(true);
        
        // Wait at least 1 second before showing results
        setTimeout(() => {
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
            setIsSearching(false);
        }, 1000);
    };

    if (loading) {
        return <Spinner />;
    }
    
    if (isSearching) {
        return <Spinner />;
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