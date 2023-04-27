import React from "react";
import SingleCard from "../Components/SingleCard"
import LoadingSpinner from "../Components/LoadingSpinner";



const DeckDisplay = ({ deckList}) => {

    function deckLoaded() {
        // return (<div className="card-grid-inner">
        //     {deckList.map(card => { return <SingleCard card={card} /> })}
        // </div>)
    }

    function deckNotLoaded() {
        return (
            <LoadingSpinner />
        )
    }
    console.log( Boolean(!deckList == null))
    return (<>
        {deckList === null ? deckNotLoaded() : deckLoaded()}
    </>)
}

export default DeckDisplay