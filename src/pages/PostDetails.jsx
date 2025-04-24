import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../styles/PostDetails.css';
import { supabase } from '../Client';

const PostDetails = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
        
            const {data} = await supabase
                .from('Posts')
                .select('*')
                .eq('id', id)
                .single();
                
            setPost(data);
            setLoading(false);
        };

        fetchPost().catch(console.error);
    }, [id]);

    if (loading) {
        return <div className="post-details">Loading post details...</div>;
    }

    if (!post) {
        return (
            <div className="post-details">
                <div className="post-actions">
                    <button className="action-button" onClick={() => navigate('/gallery')}>
                        Back to Gallery
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="post-details">
            <div className="post-header">
                <h1>{post.name}</h1>
                <h2>Superpower: {post.superpower}</h2>
            </div>
            <div className="post-content">
                <img className="detail-avatar" src={post.avatar} alt={post.name} />
                <div className="post-description">
                    <div className="avatar-description">
                        {/* <p>{avatarDescription}</p> */}
                    </div>
                </div>
            </div>
            <div className="post-actions">
                <Link to="/gallery"><button className="action-button">Back to Gallery</button></Link>
                <Link to={`/edit/${post.id}`}><button className="action-button">Edit</button></Link>
            </div>
        </div>
    );
};

export default PostDetails;