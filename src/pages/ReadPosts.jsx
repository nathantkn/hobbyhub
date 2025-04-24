import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import '../styles/ReadPosts.css'
import { supabase } from '../Client'

const ReadPosts = (props) => {
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);

            const {data} = await supabase
                .from('Posts')
                .select();

            setPosts(data);
            setLoading(false);
        }
        fetchPosts().catch(console.error);
    }, [props]);

    if (loading) {
        return <div className="post-details">Loading animal details...</div>;
    }
    
    return (
        <div className={posts && posts.length > 0 ? "ReadPosts" : "ReadPosts-empty"}>
            {
                posts && posts.length > 0 ?
                posts.map((post,index) => 
                    <Card id={post.id} name={post.name} superpower={post.superpower} avatar={post.avatar} key={post.id} />
                ) : 
                <div className="no-animals-message">
                    <h2>No Animals, No Party 😞</h2>
                </div>
            }
        </div>
    )
}

export default ReadPosts;