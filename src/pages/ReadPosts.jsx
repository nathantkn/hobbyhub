import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import '../styles/ReadPosts.css'
import { supabase } from '../Client'

const ReadPosts = () => {
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);

            const { data } = await supabase
                .from('Posts')
                .select()
                .order('created_at', { ascending: false });
                
            setPosts(data || []);
            setLoading(false);
        };
        
        fetchPosts().catch(console.error);
    }, []);

    if (loading) {
        return <div className="post-details">Loading posts...</div>;
    }
    
    return (
        <div className="posts-container">
            {posts && posts.length > 0 ? (
                <div className="ReadPosts">
                    {posts.map((post) => (
                        <Card 
                            id={post.id} 
                            title={post.title} 
                            description={post.description} 
                            image={post.image} 
                            likes={post.likes}
                            created_at={post.created_at}
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
    );
}

export default ReadPosts;