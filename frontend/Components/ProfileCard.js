import React, { useContext } from "react";
import CurrUserContext from "../Context/CurrUserContext";
import DollaryApi from "../Api/dataApi";
import { useHistory } from "react-router-dom"
import DeckContext from "../Context/DeckContext";

const ProfileCard = () => {
    const history=useHistory()
    const deckMethods=useContext(DeckContext)
    const currUser = useContext(CurrUserContext)
    const modal = document.querySelector(".profile")
    const deckFetch = async (archidekt_num) => {
         await DollaryApi.archidekt(archidekt_num)
            .then(async(resp)=>deckMethods.setDeckList(await DollaryApi.formatResponse(resp)))
            .then(history.push(`/${archidekt_num}`))
         if(modal){modal.style.display = "none"}
    }
    if (currUser !== null) {
        return (<>
            {currUser && <div className="profile-username"><a>{currUser.username}</a>'s Decks:</div>}
            {currUser && currUser.decks.length>=1 ? <ul className="profile-decklist">
                {currUser.decks.map(d => {
                    return (<li className="profile-decklink" key={d.archidekt_num}
                        onClick={() => deckFetch(d.archidekt_num)}>{d.name}</li>)
                })}
            </ul>:<div>No Decks to Display!</div>}
        </>)
    }
}
export default ProfileCard