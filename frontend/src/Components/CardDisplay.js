import React from "react";
import "./CardDisplay.css"

const CardDisplay = ({ singleCard }) => {
    const legalCard = () => {
        return (<img className="mtg-card"
            src={singleCard.img}
            alt={singleCard.name}
            title={singleCard.name} />)
    }

    const illegalCard = () => {
        return (<><img className="mtg-card illegal"
            src={singleCard.img}
            alt={singleCard.name}
            title={singleCard.name} />
        </>)

    }
    return singleCard.price > 1 ? illegalCard() : legalCard()
}

export default CardDisplay
