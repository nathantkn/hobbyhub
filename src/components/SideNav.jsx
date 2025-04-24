import { Link } from "react-router-dom";
import React from 'react';
// import logo from '../assets/logo.png';
import '../styles/SideNav.css';

const SideNav = () => {
    return (
        <div className="sideNav">
            {/* <img src={} className="logo"/> */}
            <div className='menu'>
                <ul>
                    <li className="menu-item" key="home-button">
                        <Link className="home-link" to="/">
                            Home
                        </Link>
                    </li>
                    <li className="menu-item" key="gallery-button">
                        <Link className="nav-link" to="/gallery">
                            Gallery
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default SideNav;