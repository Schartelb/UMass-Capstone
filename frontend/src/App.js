import './App.css';
import React, { useEffect, useState, useContext } from 'react';
import Home from './Routes/home';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import CurrUserContext from './Context/CurrUserContext';
import ApiMethodContext from './Context/ApiMethodContext';
import useLocalStorageState from './hooks/useLocalStorageState';
import DollaryApi from './Api/dataApi';
import UserApi from './Api/userApi';
import NavBar from './NavBar';
import jwt from "jsonwebtoken";

function App() {
  const [loginorSignup, setLoginorSignup] = useState("")
  const [currUser, setCurrUser] = useState()
  const [token, setToken] = useLocalStorageState('token', null)
  const [deckIds, setDeckIds] = useState(new Set([]))

  useEffect(function loadUserInfo() {
    // console.debug("App useEffect loadUserInfo", "token=", token);

    async function getCurrentUser() {
      if (token) {
        try {
          let { username } = jwt.decode(token);
          // put the token on the Api class so it can use it to call the API.
          UserApi.token = token;
          let currentUser = await UserApi.userInfo(username);
          setCurrUser(currentUser);
          setDeckIds(new Set(currentUser.decks));
        } catch (err) {
          console.error("App loadUserInfo: problem loading", err);
          setCurrUser(null);
        }
      }
      // setInfoLoaded(true);
    }
    // setInfoLoaded(false);
    getCurrentUser();
  }, [token]);

  async function login(userData) {
    try {
      let token = await UserApi.userLogin(userData)
      setToken(token)
    } catch (error) {
      alert(`Login Error: `, error)
    }
  }
  async function register(userData) {
    try {
      let token = await UserApi.userRegister(userData)
      // let userInfo = await UserApi.userInfo(userData.username)
      // setcurrUser({
      //   ...userInfo
      // })
      setToken(token)
      setLoginorSignup("")
    } catch (error) {
      alert(`Registration Error: `, error)
    }
  }

  async function logout() {
    setLoginorSignup("")
    setToken(null)
    setCurrUser(null)
  }

  const userMethods = { "login": login, "register": register, "logout": logout }
  return (
    <BrowserRouter>
      <CurrUserContext.Provider value={currUser}>
        <ApiMethodContext.Provider value={userMethods}>
          <NavBar
            setLoginorSignup={setLoginorSignup}
          />
          <main >
            <Switch>
              <Route>
                <Home loginorSignup={loginorSignup} />
              </Route>
            </Switch>
          </main>
        </ApiMethodContext.Provider>
      </CurrUserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
