import React, { useState } from "react";
import CardDisplay from "../Components/CardDisplay";
import SearchForm from "../Components/SearchForm";
import "./home.css"

const Home = ({ loginorSignup }) => {
    const [cardList, setCardList] = useState(null)
    const [infoLoaded, setInfoLoaded] = useState(false)

    return (<>

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