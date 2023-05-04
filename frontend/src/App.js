import './App.css';
import React, { useEffect, useState } from 'react';
import Home from './Routes/home';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import CurrUserContext from './Context/CurrUserContext';
import ApiMethodContext from './Context/ApiMethodContext';
import DeckContext from './Context/DeckContext';
import useLocalStorageState from './hooks/useLocalStorageState';
import UserApi from './Api/userApi';
import NavBar from './NavBar';
import LoadingSpinner from './Components/LoadingSpinner'
import jwt from "jsonwebtoken";
import DollaryApi from './Api/dataApi';
import DeckDisplay from './Routes/DeckDisplay';

function App() {
  const [loginorSignup, setLoginorSignup] = useState("")
  const [currUser, setCurrUser] = useState("")
  const [token, setToken] = useLocalStorageState('token', null)
  const [infoLoaded, setInfoLoaded] = useState(false)
  const [deckList, setDeckList] = useState(null)

  useEffect(function loadUserInfo() {

    async function getCurrentUser() {
      if (token) {
        try {
          let { username } = jwt.decode(token);
          UserApi.token = token;
          DollaryApi.token = token
          let currentUser = await UserApi.userInfo(username);
          setCurrUser(currentUser);
        } catch (err) {
          console.error("App loadUserInfo: problem loading", err);
          setCurrUser(null);
        }
      }
      setInfoLoaded(true);
    }
    setInfoLoaded(false);
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
  const deckMethods = {"deckList":deckList, "setDeckList":setDeckList}
  if (!infoLoaded) return <LoadingSpinner />

  return (
    <BrowserRouter>
      <CurrUserContext.Provider value={currUser}>
        <ApiMethodContext.Provider value={userMethods}>
          <DeckContext.Provider value={deckMethods}>
            <NavBar
              setLoginorSignup={setLoginorSignup}
            />
            <main >
              <Switch>
                <Route exact path="/">
                  <Home setInfoLoaded={setInfoLoaded}
                   loginorSignup={loginorSignup} />
                </Route>
                <Route exact path="/:archidekt_num">
                  <DeckDisplay setInfoLoaded={setInfoLoaded}/>
                </Route>
              </Switch>
            </main>
            </DeckContext.Provider>
        </ApiMethodContext.Provider>
      </CurrUserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
