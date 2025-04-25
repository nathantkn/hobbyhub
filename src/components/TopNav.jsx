import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import '../styles/TopNav.css';

const TopNav = ({ onSearch, onSort }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState('newest');
    const navigate = useNavigate();

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        // Pass the search query to the parent component
        if (onSearch) {
            onSearch(query);
        }
    };

    const handleSortChange = (e) => {
        const sort = e.target.value;
        setSortOption(sort);
        // Pass the sort option to the parent component
        if (onSort) {
            onSort(sort);
        }
    };

    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter') {
            // Navigate to home with search query
            navigate(`/?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className="topNav">
            <div className="logo">
                <Link to="/">UICee</Link>
            </div>
            <div className="nav-controls">
                <div className="search-bar">
                    <input 
                        type="text" 
                        placeholder="Search posts..." 
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onKeyPress={handleSearchSubmit}
                    />
                </div>
                <div className="sort-dropdown">
                    <select 
                        value={sortOption} 
                        onChange={handleSortChange}
                        className="sort-select">
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="most_likes">Most Liked</option>
                        <option value="least_likes">Least Liked</option>
                    </select>
                </div>
            </div>
            <div className='menu'>
                <ul>
                    <li className="menu-item" key="new-post-button">
                        <Link className="nav-link" to="/new">
                            New Post
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default TopNav;