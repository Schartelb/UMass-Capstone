import React from "react";

const SingleCard = ({card}) => {
    
    const legalCard = () => {
        return (<a href={card.rulings}>
            <img className="mtg-card"
                src={card.img}
                alt={card.name}
                title={card.name} /></a>)
    }

    const illegalCard = () => {
        return (<a href={card.rulings}><img className="mtg-card illegal"
            src={card.img}
            alt={card.name}
            title={card.name} />
        </a>)

    }
    return card.price > 1 ? illegalCard() : legalCard()
}

export default SingleCard