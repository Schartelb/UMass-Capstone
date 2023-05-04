import React, { useContext } from "react";
import SingleCard from "../Components/SingleCard"
import LoadingSpinner from "../Components/LoadingSpinner";
import DeckContext from "../Context/DeckContext";
import "./DeckDisplay.css"

const DeckDisplay = () => {
    const deckMethods = useContext(DeckContext)

    function deckLoaded() {
        return (
            <div className="card-grid-inner">
                {deckMethods.deckList.map(card => {
                    return <SingleCard
                        key={card.name}
                        card={card}
                        />
                })}
            </div>
        )
    }

    function deckNotLoaded() {
        return (
            <LoadingSpinner />
        )
    }
    return (<>
        {deckMethods.deckList === undefined || deckMethods.deckList === null ? deckNotLoaded() : deckLoaded()}
    </>)
}

export default DeckDisplay