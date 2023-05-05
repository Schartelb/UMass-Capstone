import React, { useContext, useState } from "react";
import DollaryApi from "../Api/dataApi";
import UserApi from "../Api/userApi";
import { useHistory } from "react-router-dom";
import "./SearchForm.css"
import DeckContext from "../Context/DeckContext";
import CurrUserContext from "../Context/CurrUserContext";


const SearchForm = ({ setCardList, setInfoLoaded }) => {
    const deckMethods = useContext(DeckContext)
    const history = useHistory()
    const userContext = useContext(CurrUserContext)
    const [formData, setFormData] = useState()
    const handleChange = evt => {
        const { name, value } = evt.target;
        setFormData(formData => ({
            ...formData,
            [name]: value
        }));
    }

    const handleSingleSubmit = (evt) => {
        evt.preventDefault()
        try {
            console.log("Single Search")
            DollaryApi.formatResponse([formData.cardName])
                .then((c) => {
                    setCardList(c)
                }).catch(err => {
                    console.log(err)
                })
        } catch (error) {
            alert("Search Error! Please Try again")
        }
    }
    const handleMultiSubmit = evt => {
        evt.preventDefault()
        try {
            DollaryApi.multiCall(formData.cardList)
                .then((d) => {
                    setCardList(d)
                }).catch(error => {
                    console.log("MultiSearch Error: ", error)
                })
        } catch (error) {
            alert("Search Error! Please Try again")
        }
    }
    const handleArchidektSubmit = evt => {
        evt.preventDefault()
        try {
            setInfoLoaded(false)
            DollaryApi.archidekt(formData.deckNumber)
                .then(async (d) => {
                    deckMethods.setDeckList(await DollaryApi.formatResponse(d))
                })
                .then(async () => userContext.setCurrUser(await UserApi.userInfo(userContext.currUser.username)))
                .then(history.push(`/${formData.deckNumber}`))
                .catch(err => {
                    console.log(err)
                })
        } catch (error) {
            alert("Search Error! Please Try again")
        }
    }
    return (
        <div className="form-wrapper">
            <form >
                <label className="input" htmlFor="cardName">Card Name: </label>
                <input
                    type='text'
                    id="cardName"
                    name="cardName"
                    onChange={handleChange}
                    placeholder="Card Name"
                />
                <button onClick={handleSingleSubmit}>Search</button>
            </form>
            <form>
                <label className="input" htmlFor="deckNumber">Archidekt Deck Number: </label>
                <input
                    type='number'
                    id="deckNumber"
                    name="deckNumber"
                    onChange={handleChange}
                    placeholder="Deck Number"
                    maxLength={7}
                />
                <button onClick={handleArchidektSubmit}>Search</button>
            </form>
            <form>
                <label className="input" htmlFor="cardList">Card Names: </label>
                <textarea
                    type='text'
                    id="cardList"
                    name="cardList"
                    onChange={handleChange}
                    placeholder="One Card per Line"
                />
                <button onClick={handleMultiSubmit}>Search</button>
            </form>

        </div>
    )

}

export default SearchForm