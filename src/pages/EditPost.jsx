import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/EditPost.css';
import { supabase } from '../Client';

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState({
        id: id,
        title: "",
        description: "",
        image: "",
        likes: 0
    });

    // Load data for the specific post from database when component mounts
    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            
            // Fetch specific post by id from Supabase
            const { data } = await supabase
                .from('Posts')
                .select('*')
                .eq('id', id)
                .single();
            
            setPost({
                id: data.id,
                title: data.title,
                description: data.description || "",
                image: data.image || "",
                likes: data.likes || 0
            });
            
            setLoading(false);
        };

        fetchPost().catch(console.error);
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setPost((prev) => {
            return {
                ...prev,
                [name]: value,
            };
        });
    };

    const updatePost = async (event) => {
        event.preventDefault();

        // Validate input fields
        if (!post.title) {
            alert("Title is required");
            return;
        }

        const {} = await supabase
            .from('Posts')
            .update({
                title: post.title,
                description: post.description,
                image: post.image
            })
            .eq('id', id);

        // Redirect to the post's detail page on success
        navigate(`/post/${id}`);
    };

    const deletePost = async (event) => {
        event.preventDefault();

        if (window.confirm("Are you sure you want to delete this post?")) {
            const {} = await supabase
                .from('Posts')
                .delete()
                .eq('id', id);

            navigate('/');
        }
    };

    if (loading) {
        return <div className="edit-container">Loading post details...</div>;
    }

    return (
        <div className="edit-container">
            <h1>Edit Post</h1>
            <form className="edit-form">
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={post.title}
                        onChange={handleChange}
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
                    />
                </div>

                {post.image && (
                    <div className="image-preview">
                        <img src={post.image} alt="Preview" />
                    </div>
                )}

                <div className="button-group">
                    <button type="button" className="back-button" onClick={() => navigate(`/post/${id}`)}>
                        Back
                    </button>
                    <button type="submit" className="update-button" onClick={updatePost}>
                        Update Post
                    </button>
                    <button type="button" className="delete-button" onClick={deletePost}>
                        Delete Post
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditPost;