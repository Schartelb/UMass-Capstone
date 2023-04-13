import React, { useState, useContext } from "react";
import SingleSearch from "../Components/SingleSearch";
import MultiSearch from "../Components/MultiSearch";
import ArchidektSearch from "../Components/ArchidektSearch";
import CardDisplay from "../Components/CardDisplay";
import DeckDisplay from "../Components/DeckDisplay";
import LoginSignup from "../Components/LoginSignup";


const Home = ({ loginorSignup }) => {
    const [singleCard, setSingleCard] = useState(null)
    const [deckList, setDeckList] = useState(null)
    const [isLoading, setisLoading] = useState(false)
    return (<>
        <div className="modal">
            <div className="modal_content">
                <span className="close">&times;</span>
                <LoginSignup signUpIn={loginorSignup} />
            </div>
        </div>
        <section className="container">
            <div id="col-1">
                <h2>Welcome to Dollary Deck Check!</h2>
                <SingleSearch setSingleCard={setSingleCard} />
                <ArchidektSearch setDeckList={setDeckList} setisLoading={setisLoading} />
                <MultiSearch setDeckList={setDeckList} setisLoading={setisLoading} />
            </div>
            <div id="col-2">
                {singleCard === null ?
                    <img className="mtg-card"
                        src="https://i.imgur.com/LdOBU1I.jpeg"
                        alt="Magic Card Back" /> :
                    <CardDisplay singleCard={singleCard} />}
            </div>
        </section>
        <section className="card-grid" id="deckDisplay">
            {deckList === null && <h2>No Deck to Display!</h2>}
            {deckList !== null && <DeckDisplay deckList={deckList}
                setisLoading={setisLoading} isLoading={isLoading} />}
        </section>
    </>
    )
}

export default Home