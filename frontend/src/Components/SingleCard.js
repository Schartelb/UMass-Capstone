import React from "react";

const SingleCard = ({card}) => {
    
    return(
        <a href={card.rulings}>
        <div className="card-grid-item-card-faces">
        <img alt={card.name} className="card" src={card.img}/>
        </div>
        </a>
    )    
}

export default SingleCard