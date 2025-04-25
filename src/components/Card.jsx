import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/Card.css'
import { supabase } from '../Client'

const Card = (props) =>  {
    // Add local state to track likes
    const [likesCount, setLikesCount] = useState(props.likes || 0);

    const formatTimeAgo = (dateString) => {
        if (!dateString) return "Unknown date";

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

    // Add a like handler function
    const handleLike = async (e) => {
        // Prevent the event from bubbling up to the Link component
        e.preventDefault();
        e.stopPropagation();
        
        try {
            // First update the local state immediately for responsive UI
            const newLikesCount = likesCount + 1;
            setLikesCount(newLikesCount);
            
            // Then update the database
            const { data, error } = await supabase
                .from('Posts')
                .update({ likes: newLikesCount })
                .eq('id', props.id)
                .select();
            
            if (error) {
                // If there was an error, revert the local state
                console.error('Error updating likes:', error);
                setLikesCount(likesCount);
            } 
            // If the update was successful, notify the parent component
            else if (data && data.length > 0 && props.onLike) {
                props.onLike(props.id, data[0].likes);
            }
        } catch (err) {
            console.error('Error in handleLike:', err);
            // Revert on any error
            setLikesCount(likesCount);
        }
    };

    return (
        <div className="Card">
            <Link to={'/post/'+ props.id} className="card-link">
                <h2 className="title">{props.title}</h2>
                
                {props.description && props.description.length > 0 && (
                    <p className="description">{props.description.length > 100 
                        ? `${props.description.substring(0, 100)}...` 
                        : props.description}
                    </p>
                )}
                
                {props.image && (
                    <img className="post-image" src={props.image} alt={props.title} />
                )}
                
                <div className="post-stats">
                <button 
                    className="likes-button" 
                    onClick={handleLike}
                    aria-label="Like this post"
                >
                    ❤️ {likesCount}
                </button>
                    <span className="post-time">{formatTimeAgo(props.created_at)}</span>
                </div>
            </Link>
        </div>
    );
};

export default Card;