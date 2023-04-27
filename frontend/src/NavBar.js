import React, { useContext } from "react";
import "./NavBar.css";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, NavItem } from "reactstrap";
import ApiMethodContext from "./Context/ApiMethodContext";
import CurrUserContext from "./Context/CurrUserContext";

const NavBar = ({ setLoginorSignup }) => {
    const apiMethods = useContext(ApiMethodContext)
    const currUser = useContext(CurrUserContext)
    const handleClick = (evt) => {
        let target = evt.target.innerText
        if (target === "Logout") {
            apiMethods.logout()
        }
        else {
            setLoginorSignup(target)
            const loginsignup = document.querySelector("#loginsignup")
            const closeBtn = document.querySelector("#logclose")
            target === "Login" || target === "Signup" ?
                loginsignup.style.display = "block" :
                loginsignup.style.display = "none"
            closeBtn.addEventListener("click", () => {
                loginsignup.style.display = "none";
            }
            )
        }
    }
    const profileClick = () => {
        const profile = document.querySelector("#profile")
        profile.style.display = "block"
        const closeBtn = document.querySelector("#profileclose")
        closeBtn.addEventListener("click", () => {
            profile.style.display = "none";
        }
        )
    }

    function loggedOutNav() {
        return (
            <>
                <NavItem className="nav">
                    <div onClick={handleClick}>Login</div >
                </NavItem>
                <NavItem className="nav">
                    <div onClick={handleClick}>Signup</div >
                </NavItem>
            </>
        )
    }

    function loggedInNav() {
        return (
            <>
                <NavItem onClick={profileClick}>
                    Profile
                </NavItem >
                <NavItem className="nav" onClick={handleClick}>Logout</NavItem>
            </>
        )
    }
    return (
        <div>
            <Navbar expand="md">
                <NavLink exact to="/" className="navbar-brand">
                    Home
                </NavLink>
                <Nav className="ml-auto" navbar>
                {currUser ? loggedInNav():loggedOutNav()}
                </Nav>
            </Navbar>
        </div>
    )
}

export default NavBar
