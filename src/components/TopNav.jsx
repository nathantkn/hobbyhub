import { Link } from "react-router-dom";
import React from 'react';
import '../styles/TopNav.css';

const TopNav = () => {
    return (
        <div className="topNav">
            <div className="logo">
                <Link to="/">UICee</Link>
            </div>
            <div className="search-bar">
                <input type="text" placeholder="Search..." />
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