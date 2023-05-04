import React, { useState } from "react";
import "./CardDisplay.css"
import SingleCard from "./SingleCard";

const CardDisplay = ({ cardList }) => {
    const [currCardIdx, setCurrCardIdx] = useState(0);
    const currCard = cardList[currCardIdx];
    const total = cardList.length;

    //Increments currCardIdx state up by 1
    function goForward() {
        let index = currCardIdx + 1
        index === total ? setCurrCardIdx(0) : setCurrCardIdx(index);
    }

    //Increments currCardIdx state down by 1
    function goBackward() {
        currCardIdx === 0 ? setCurrCardIdx(total - 1) : setCurrCardIdx(currCardIdx - 1);
    }

    const rightArrow = <img
        src="https://upload.wikimedia.org/wikipedia/commons/f/f9/Antu_arrow-right.svg"
        className="bi bi-arrow-right-circle"
        alt="right arrow"
        onClick={goForward}
    />

    const leftArrow = <img
        src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Antu_arrow-left.svg"
        className="bi bi-arrow-left-circle"
        alt="left arrow"
        onClick={goBackward}
    />

    return (
        <div className="carousel">

            <SingleCard
                card={currCard}
            />
            <div className="overlay">
                {currCardIdx !== 0 ? leftArrow : <></>}
                {cardList.length > 1 ? currCardIdx !== (cardList.length - 1) ? rightArrow : <></> : <></>}
            </div>
        </div>
    );
}

export default CardDisplay
