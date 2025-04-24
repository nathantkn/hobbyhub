import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/EditPost.css';
import { supabase } from '../Client';
// import { avatarOptions } from '../utils/avatars';

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [animal, setAnimal] = useState({
        id: id,
        name: "",
        superpower: "",
        avatar: "",
        selectedAvatarName: "" // Track selected avatar name
    });

    // Helper function to get avatar name from image URL
    const getAvatarNameFromImage = (imageUrl) => {
        const matchingAvatar = avatarOptions.find(avatar => avatar.image === imageUrl);
        return matchingAvatar ? matchingAvatar.name : "";
    };

    // Load data for the specific animal from database when component mounts
    useEffect(() => {
        const fetchAnimal = async () => {
            setLoading(true);
            
            // Fetch specific animal by id from Supabase
            const {data} = await supabase
                .from('Posts')
                .select('*')
                .eq('id', id)
                .single();

            // Find which avatar name corresponds to the current image
            const avatarName = getAvatarNameFromImage(data.avatar);
            
            setAnimal({
                id: data.id,
                name: data.name,
                superpower: data.superpower,
                avatar: data.avatar,
                selectedAvatarName: avatarName
            });
            
            setLoading(false);
        };

        fetchAnimal().catch(console.error);
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setAnimal((prev) => {
            return {
                ...prev,
                [name]: value,
            };
        });
    };

    // Handle avatar selection from dropdown
    const handleAvatarChange = (event) => {
        const selectedAvatarName = event.target.value;
        const selectedAvatar = avatarOptions.find(avatar => avatar.name === selectedAvatarName);
        
        if (selectedAvatar) {
            setAnimal((prev) => {
                return {
                    ...prev,
                    avatar: selectedAvatar.image,
                    selectedAvatarName: selectedAvatarName
                };
            });
        } else {
            // If "Select an avatar" is chosen
            setAnimal((prev) => {
                return {
                    ...prev,
                    avatar: "",
                    selectedAvatarName: ""
                };
            });
        }
    };

    const updateAnimal = async (event) => {
        event.preventDefault();

        // Validate input fields
        if (!animal.name || !animal.superpower || !animal.avatar) {
            alert("Please fill in all fields");
            return;
        }

        const {} = await supabase
            .from('Posts')
            .update({
                name: animal.name,
                superpower: animal.superpower,
                avatar: animal.avatar
            })
            .eq('id', id);

        // Redirect to the animal's detail page on success
        navigate(`/post/${id}`);
    };

    const deleteAnimal = async (event) => {
        event.preventDefault();

        if (window.confirm("Are you sure you want to delete this animal?")) {
            const {} = await supabase
                .from('Posts')
                .delete()
                .eq('id', id);

            navigate('/gallery');
        }
    };

    if (loading) {
        return <div className="edit-container">Loading animal details...</div>;
    }

    return (
        <div className="edit-container">
            <h1>Edit Animal</h1>
            <form className="edit-form">
                <div className="form-group">
                    <label htmlFor="name">Animal Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={animal.name}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="superpower">Superpower</label>
                    <input
                        type="text"
                        id="superpower"
                        name="superpower"
                        value={animal.superpower}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="avatar">Avatar</label>
                    <select 
                        id="avatar" 
                        name="avatar" 
                        value={animal.selectedAvatarName}
                        onChange={handleAvatarChange}
                        className="avatar-select"
                    >
                        <option value="">Select an avatar</option>
                        {avatarOptions.map((avatar, index) => (
                            <option key={index} value={avatar.name}>
                                {avatar.name}
                            </option>
                        ))}
                    </select>
                </div>

                {animal.avatar && (
                    <div className="avatar-preview">
                        <img src={animal.avatar} alt={animal.name || "Selected avatar"} />
                    </div>
                )}

                <div className="button-group">
                    <button type="button" className="back-button" onClick={() => navigate(`/post/${id}`)}>
                        Back
                    </button>
                    <button type="submit" className="update-button" onClick={updateAnimal}>
                        Update Animal
                    </button>
                    <button type="button" className="delete-button" onClick={deleteAnimal}>
                        Delete Animal
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditPost;