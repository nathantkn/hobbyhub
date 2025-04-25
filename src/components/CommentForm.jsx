import React, { useState } from 'react';
import '../styles/CommentForm.css';
import { supabase } from '../Client';

const CommentForm = ({ postId, onCommentAdded }) => {
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!comment.trim()) {
            alert('Please enter a comment');
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            // Insert comment into database
            const { data, error } = await supabase
                .from('Comments')
                .insert([{
                    post_id: postId,
                    content: comment,
                    likes: 0
                }])
                .select();
            
            // Clear the form
            setComment('');
            
            // Notify parent component that a comment was added
            if (onCommentAdded && data) {
                onCommentAdded(data[0]);
            }
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Failed to add comment. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="comment-form-container">
            <h3>Add a Comment</h3>
            <form onSubmit={handleSubmit} className="comment-form">
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your comment here..."
                    rows="3"
                    required
                />
                <button 
                    type="submit" 
                    className="comment-submit-btn"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Posting...' : 'Post Comment'}
                </button>
            </form>
        </div>
    );
};

export default CommentForm;