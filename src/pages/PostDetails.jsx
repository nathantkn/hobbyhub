import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../Client';

import CommentForm from '../components/CommentForm';
import Comment from '../components/Comment';
import '../styles/PostDetails.css';

const PostDetails = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [likesCount, setLikesCount] = useState(0);
    const navigate = useNavigate();

    const formatTimeAgo = (dateString) => {
        if (!dateString) return "Unknown time";
        
        // Parse the PostgreSQL timestamp
        const date = new Date(dateString);
        const now = new Date();
        
        const secondsAgo = Math.floor((now - date) / 1000);
        
        // Calculate the appropriate time unit
        if (secondsAgo < 60) {
            return "Just now";
        }
        if (secondsAgo < 3600) {
            const minutes = Math.floor(secondsAgo / 60);
            return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
        }
        if (secondsAgo < 86400) {
            const hours = Math.floor(secondsAgo / 3600);
            return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
        }
        if (secondsAgo < 604800) {
            const days = Math.floor(secondsAgo / 86400);
            return `${days} ${days === 1 ? 'day' : 'days'} ago`;
        }
        if (secondsAgo < 2592000) {
            const weeks = Math.floor(secondsAgo / 604800);
            return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
        }
        if (secondsAgo < 31536000) {
            const months = Math.floor(secondsAgo / 2592000);
            return `${months} ${months === 1 ? 'month' : 'months'} ago`;
        }
        
        const years = Math.floor(secondsAgo / 31536000);
        return `${years} ${years === 1 ? 'year' : 'years'} ago`;
    };

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
        
            const {data} = await supabase
                .from('Posts')
                .select('*')
                .eq('id', id)
                .single();
                
            if (data) {
                setPost(data);
                setLikesCount(data.likes || 0);
            }
            setLoading(false);
        };

        const fetchComments = async () => {
            setCommentsLoading(true);
            
            const { data } = await supabase
                .from('Comments')
                .select('*')
                .eq('post_id', id)
                .order('created_at', { ascending: false });
                
            setComments(data || []);
            setCommentsLoading(false);
        };

        fetchPost().catch(console.error);
        fetchComments().catch(console.error);
    }, [id]);

    const handleCommentAdded = (newComment) => {
        // Add the new comment to the beginning of the comments array
        setComments([newComment, ...comments]);
    };

    const handleLike = async () => {
        try {
            // First update the UI immediately
            const newLikesCount = likesCount + 1;
            setLikesCount(newLikesCount);
            
            // Then update the database
            const { data, error } = await supabase
                .from('Posts')
                .update({ likes: newLikesCount })
                .eq('id', id)
                .select();
            
            if (error) {
                // If there was an error, revert the local state
                console.error('Error updating likes:', error);
                setLikesCount(likesCount);
            }
            // If the update was successful, update the post state too
            else if (data && data.length > 0) {
                setPost({ ...post, likes: data[0].likes });
            }
        } catch (err) {
            console.error('Error in handleLike:', err);
            // Revert on any error
            setLikesCount(likesCount);
        }
    };

    if (loading) {
        return <div className="post-details">Loading post details...</div>;
    }

    if (!post) {
        return (
            <div className="post-details">
                <div className="error-message">
                    <h2>Post not found</h2>
                </div>
                <div className="post-actions">
                    <button className="action-button" onClick={() => navigate('/')}>
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="post-details">
            <div className="post-header">
                <h1>{post.title}</h1>
                <p className="post-time">{formatTimeAgo(post.created_at)}</p>
            </div>
            <div className="post-content">
                {post.image && (
                    <img className="detail-image" src={post.image} alt={post.title} />
                )}
                <div className="post-description">
                    {post.description &&
                        <p>{post.description}</p>}
                </div>
                
                <div className="likes-section">
                    <button className="like-button" onClick={handleLike}>
                        ❤️ {likesCount} likes
                    </button>
                </div>
            </div>

            <div className="comments-section">
                <h2>Comments ({comments.length})</h2>
                
                <div className="comments-list">
                    {commentsLoading ? (
                        <p className="loading-comments">Loading comments...</p>
                    ) : comments.length > 0 ? (
                        comments.map(comment => (
                            <Comment key={comment.id} comment={comment} />
                        ))
                    ) : (
                        <p className="no-comments">No comments yet. Be the first to comment!</p>
                    )}
                </div>

                <CommentForm postId={id} onCommentAdded={handleCommentAdded} />
            </div>
            
            <div className="post-actions">
                <Link to="/"><button className="action-button">Back to Home</button></Link>
                <Link to={`/edit/${post.id}`}><button className="action-button">Edit Post</button></Link>
            </div>
        </div>
    );
};

export default PostDetails;