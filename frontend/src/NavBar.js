import React, { useContext } from "react";
// import "./NavBar.css";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, NavItem } from "reactstrap";
import ApiMethodContext from "./Context/ApiMethodContext";
import CurrUserContext from "./Context/CurrUserContext";

const NavBar = ({ setLoginorSignup }) => {
    const apiMethods = useContext(ApiMethodContext)
    const currUser = useContext(CurrUserContext)
    const token = window.localStorage.getItem('token')
    const handleClick = (evt) => {
        let target = evt.target.innerText
        console.log(target)
        if (target === "Logout") {
            apiMethods.logout()
        }
        else {
            setLoginorSignup(target)
            const modal = document.querySelector(".modal")
            const closeBtn = document.querySelector(".close")
            target == "Login" || target == "Signup" ?
                modal.style.display = "block" :
                modal.style.display = "none"
            closeBtn.addEventListener("click", () => {
                modal.style.display = "none";
            }
            )
        }
    }
    const profileClick = (evt)=>{
        console.log("Profile: ", currUser)
    }
    return (
        <div>
            <Navbar expand="md">
                <NavLink exact to="/" className="navbar-brand">
                    Dollary Deck Check Home!
                </NavLink>

                <Nav className="ml-auto" navbar>

                    {token === 'undefined' && <> <NavItem className="nav">
                        <div onClick={handleClick}>Login</div >
                    </NavItem>
                        <NavItem className="nav">
                            <div onClick={handleClick}>Signup</div >
                        </NavItem></>}
                    {token !== 'undefined' && <><NavItem onClick={profileClick}>
                        Profile
                    </NavItem >
                        <NavItem className="nav" onClick={handleClick}>Logout</NavItem></>}

                </Nav>
            </Navbar>
        </div>
    )
}

export default NavBar
