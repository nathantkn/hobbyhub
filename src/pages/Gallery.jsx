import React from 'react';
import { Link } from 'react-router-dom';
import ReadPosts from './ReadPosts';
import '../styles/Gallery.css';

const Gallery = ({ data }) => {
    return (
        <div className="gallery-container">
            <div className="gallery-header">
                <h1>Animal Gallery</h1>
                <Link to="/new">
                    <button className="create-animal-btn">Create Your Animal</button>
                </Link>
            </div>
            <ReadPosts data={data} />
        </div>
    );
};

export default Gallery;