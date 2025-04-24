import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/Card.css'


const Card = (props) =>  {

    return (
        <div className="Card">
            <Link to={'/post/'+ props.id} className="card-link">
                <h2 className="title">{props.name}</h2>
                <h3 className="author">{props.superpower}</h3>
                <img className="avatar" src={props.avatar} />
            </Link>
        </div>
    );
};

export default Card;