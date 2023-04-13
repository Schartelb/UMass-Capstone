import React, { useState } from "react";
import DollaryApi from "../Api/dataApi";

const ArchidektSearch = ({ setDeckList, setisLoading }) => {
    const [formData, setFormData] = useState()
    const handleChange = evt => {
        const { name, value } = evt.target;
        setFormData(formData => ({
            ...formData,
            [name]: value
        }));
    }
    const handleSubmit = async (evt) => {
        setisLoading(true)
        evt.preventDefault()
        DollaryApi.archidekt(formData.deckNumber)
            .then(d => { setDeckList(d) })
            .catch(err => {
                console.log(err)
            })
        // .finally(setisLoading(false))
    }

    return (
        <form onSubmit={handleSubmit}>
            <label className="input" htmlFor="deckNumber">Archidekt Deck Number: </label>
            <input
                type='number'
                id="deckNumber"
                name="deckNumber"
                onChange={handleChange}
                placeholder="Deck Number"
                maxLength={7}
            />
            <input type="submit" value="Search" />
        </form>
    )
}
export default ArchidektSearch