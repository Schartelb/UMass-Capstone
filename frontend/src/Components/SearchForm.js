import React, { useContext, useState } from "react";
import DollaryApi from "../Api/dataApi";
import { useHistory } from "react-router-dom";
import "./SearchForm.css"

const SearchForm = ({  setDeckList, setSingleCard, setInfoLoaded }) => {
    const history = useHistory()
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
        DollaryApi.formatResponse([formData.cardName]).then((c) => {
            setSingleCard(c[0])
        }).catch(err => {
            console.log(err)
        })
    }
    const handleMultiSubmit = evt => {
        evt.preventDefault()
        DollaryApi.multiCall(formData.cardList).then((d) => {
            console.log(d)
            setDeckList(d.data)
        }).catch(error => {
            console.log("MultiSearch Error: ", error)
        })
    }
    const handleArchidektSubmit = evt => {
        setInfoLoaded(false)
        evt.preventDefault()
        // console.log(formData.deckNumber)
        DollaryApi.archidekt(formData.deckNumber)
            .then(d => { setDeckList(d) })
            .then(history.push(`/${formData.deckNumber}`))
            .catch(err => {
                console.log(err)
            })
    }
    return (
        <>
            <form className="form-wrapper">
                <label className="input" htmlFor="cardName">Card Name: </label>
                <input
                    type='text'
                    id="cardName"
                    name="cardName"
                    onChange={handleChange}
                    placeholder="Card Name"
                />
                <button type="submit" onClick={(handleSingleSubmit)}>Search</button>
                <label className="input" htmlFor="deckNumber">Archidekt Deck Number: </label>
                <input
                    type='number'
                    id="deckNumber"
                    name="deckNumber"
                    onChange={handleChange}
                    placeholder="Deck Number"
                    maxLength={7}
                />
                <button type="submit" onClick={handleArchidektSubmit}>Search</button>
                <label className="input" htmlFor="cardList">Card Names: </label>
                <textarea
                    type='text'
                    id="cardList"
                    name="cardList"
                    onChange={handleChange}
                    placeholder="One Card per Line"
                />
                <button type="submit" onClick={handleMultiSubmit}>Search
                </button>
            </form>

        </>
    )

}

export default SearchForm