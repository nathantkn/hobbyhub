import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/Card.css'


const Card = (props) =>  {

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
                    <span className="likes-count">❤️ {props.likes || 0}</span>
                </div>
            </Link>
        </div>
    );
};

export default Card;