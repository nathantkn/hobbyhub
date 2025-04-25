import React, { useState } from 'react';
import '../styles/Comment.css';
import { supabase } from '../Client';

const Comment = ({ comment }) => {
    const [likesCount, setLikesCount] = useState(comment.likes || 0);

    const formatTimeAgo = (dateString) => {
        if (!dateString) return "Unknown time";
        
        // Parse the PostgreSQL timestamp
        const date = new Date(dateString);
        const now = new Date();
        
        const secondsAgo = Math.floor((now - date) / 1000);

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

    const handleLike = async () => {
        try {
            // First update the local state immediately for responsive UI
            const newLikesCount = likesCount + 1;
            setLikesCount(newLikesCount);
            
            // Then update the database
            const { error } = await supabase
                .from('Comments')
                .update({ likes: newLikesCount })
                .eq('id', comment.id);
                
            if (error) {
                // If there was an error, revert the local state
                console.error('Error updating likes:', error);
                setLikesCount(likesCount);
            }
        } catch (err) {
            console.error('Error in handleLike:', err);
            // Revert on any error
            setLikesCount(likesCount);
        }
    };

    return (
        <div className="comment">
            <div className="comment-content">
                <p>{comment.content}</p>
            </div>
            <div className="comment-footer">
                <span className="comment-time">{formatTimeAgo(comment.created_at)}</span>
                <button className="comment-like-btn" onClick={handleLike}>
                    ❤️ {likesCount}
                </button>
            </div>
        </div>
    );
};

export default Comment;