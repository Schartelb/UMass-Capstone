import React, { useState } from "react";
import CardDisplay from "../Components/CardDisplay";
import LoginSignup from "../Components/LoginSignup";
import ProfileCard from "../Components/ProfileCard"
import SearchForm from "../Components/SearchForm";
import "./home.css"

const Home = ({ loginorSignup }) => {
    const [cardList, setCardList] = useState(null)
    const [deckList, setDeckList] = useState(null)
    const [infoLoaded, setInfoLoaded] = useState(false)

    return (<>
        <div id="loginsignup" className="card-wrapper">
            <span id="logclose">&times;</span>
            <LoginSignup signUpIn={loginorSignup} />
        </div>

        <div id="profile" className="card-wrapper">
            <span id="profileclose">&times;</span>
            <ProfileCard />
        </div>
        <section className="container">
            <div id="col-1">
                <h2>Welcome to Dollary Deck Check!</h2>
                <SearchForm setCardList={setCardList} setInfoLoaded={setInfoLoaded} />
            </div>
            <div id="col-2">
                {cardList === null ?
                    <img className="mtg-card"
                        src="https://i.imgur.com/LdOBU1I.jpeg"
                        alt="Magic Card Back" /> :
                    <CardDisplay cardList={cardList} />
                }
            </div>
        </section>
        {/* {!infoLoaded && deckList !== null && <section className="card-grid" id="deckDisplay">
            <DeckDisplay deckList={deckList} />
        </section>} */}
    </>
    )
}

export default Home