import React, { useContext } from "react";
import CurrUserContext from "../Context/CurrUserContext";
import DollaryApi from "../Api/dataApi";
import UserApi from "../Api/userApi";
import { useHistory } from "react-router-dom"
import DeckContext from "../Context/DeckContext";

const ProfileCard = () => {
    const history = useHistory()
    const deckMethods = useContext(DeckContext)
    const userContext = useContext(CurrUserContext)
    const modal = document.querySelector(".profile")
    const deckFetch = async (archidekt_num) => {
        try {
            await DollaryApi.archidekt(archidekt_num)
                .then(async (resp) => deckMethods.setDeckList(await DollaryApi.formatResponse(resp)))
                .then(history.push(`/${archidekt_num}`))
            if (modal) { modal.style.display = "none" }
        } catch (error) {
            alert("Couldn't Find that Deck")
        }
    }
    const deckDelete = async (archidekt_num) => {
        try {
            await UserApi.removeDeck(archidekt_num)
            .then(async ()=>{ userContext.setCurrUser(await UserApi.userInfo(userContext.currUser.username))})
        } catch (error) {
            alert("Deck Deletion Error: ", error)
        }
    }
    if (userContext.currUser !== null) {
        return (<>
            {userContext.currUser && <div className="profile-username"><a>{userContext.currUser.username}</a>'s Decks:</div>}
            {userContext.currUser && userContext.currUser.decks.length >= 1 ? <ul className="profile-decklist">
                {userContext.currUser.decks.map(d => {
                    return (
                        <>
                            <li className="profile-decklink" key={d.archidekt_num}
                                onClick={() => deckFetch(d.archidekt_num)}>{d.name}</li>
                            <button onClick={() => deckDelete(d.archidekt_num)} className="remove-button"><div>x</div></button>
                        </>)
                })}
            </ul> : <div>No Decks to Display!</div>}
        </>)
    }
}

export default ProfileCard