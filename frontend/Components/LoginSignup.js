import React, { useState, useContext } from "react";
// import { Card, CardBody, CardTitle } from "reactstrap";
import ApiMethodContext from "../Context/ApiMethodContext";

const LoginSignup = ({ signUpIn }) => {

    const apiMethods = useContext(ApiMethodContext)
    const [formData, setFormData] = useState()
    const modal = document.querySelector("#loginsignup")
    const handleChange = evt => {
        const { name, value } = evt.target;
        setFormData(formData => ({
            ...formData,
            [name]: value
        }));
    }
    const LoginSubmit = evt => {
        evt.preventDefault()
        apiMethods.login(formData)
        modal.style.display = "none"
    }
    const SignupSubmit = evt => {
        evt.preventDefault()
        apiMethods.register(formData)
        modal.style.display = "none"
    }
    return (
        <section className="col-md-4">
            Please {signUpIn === "Signup" && <>Register!</>}
            {signUpIn === "Login" && <>Login!</>}

            <form >
                <label className="input" htmlFor="username">Username: </label>
                <input
                    type='text'
                    id="username"
                    name="username"
                    onChange={handleChange}
                />

                <label className="input" htmlFor="password">Password: </label>
                <input
                    type='password'
                    id="password"
                    name="password"
                    onChange={handleChange}
                />

                {signUpIn === "Login" && <button onClick={LoginSubmit}>Sign In!</button>}
                {signUpIn === "Signup" && <>
                    <label className="input" htmlFor="firstName">First Name: </label>
                    <input
                        type='text'
                        id="firstName"
                        name="firstName"
                        onChange={handleChange}
                    />

                    <label className="input" htmlFor="lastName">Last Name: </label>
                    <input
                        type='text'
                        id="lastName"
                        name="lastName"
                        onChange={handleChange}
                    />

                    <label className="input" htmlFor="email">Email: </label>
                    <input
                        type='email'
                        id="email"
                        name="email"
                        onChange={handleChange}
                    />

                    <button onClick={SignupSubmit}>Signup!</button></>}
            </form>
            {/* # */}
        </section>
    )
}

export default LoginSignup