import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CreatePost.css';
import { supabase } from '../Client';

const CreatePost = () => {
    const navigate = useNavigate();
    const [post, setPost] = useState({
        title: "",
        description: "",
        image: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setPost((prev) => {
            return {
                ...prev,
                [name]: value,
            };
        });
    };

    const createPost = async (event) => {
        event.preventDefault();

        // Validate input fields
        if (!post.title) {
            alert("Title is required");
            return;
        }

        // Insert the new post into the database
        const {} = await supabase
            .from('Posts')
            .insert({
                title: post.title,
                description: post.description,
                image: post.image,
                likes: 0
            })
            .select();

        navigate('/');
    };

    return (
        <div className="create-container">
            <h1>Create New Post</h1>
            <form className="create-form">
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={post.title}
                        onChange={handleChange}
                        placeholder="Enter post title"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={post.description}
                        onChange={handleChange}
                        placeholder="Enter post description"
                        rows="5"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="image">Image URL (Optional)</label>
                    <input
                        type="text"
                        id="image"
                        name="image"
                        value={post.image}
                        onChange={handleChange}
                        placeholder="Enter image URL"
                    />
                </div>

                {post.image && (
                    <div className="image-preview">
                        <img src={post.image} alt="Preview" />
                    </div>
                )}

                <div className="button-group">
                    <button type="button" className="back-button" onClick={() => navigate('/')}>
                        Cancel
                    </button>
                    <button type="submit" className="create-button" onClick={createPost}>
                        Create Post
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;