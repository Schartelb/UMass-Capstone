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

function App() {
  const [loginorSignup, setLoginorSignup] = useState("")
  const [currUser, setcurrUser] = useState()
  const [token, setToken] = useLocalStorageState('token', "")

  async function login(userData) {
    try {
      let token = await UserApi.userLogin(userData)
      setToken(token)
      let userInfo = await UserApi.userInfo(userData.username)
      setcurrUser({
        ...userInfo,
      })

    } catch (error) {
      alert(`Login Error: `, error)
    }
  }
  async function register(userData) {
    try {
      let token = await UserApi.userRegister(userData)
      let userInfo = await UserApi.userInfo(userData.username)
      setcurrUser({
        ...userInfo
      })
      setToken(token)
      setLoginorSignup("")
    } catch (error) {
      alert(`Registration Error: `, error)
    }
  }
  // async function profile(userData) {
  //   try {
  //     let userInfo = await UserApi.userInfo(userData.username)
  //   } catch (error) {
  //     alert('Profile Display Error: ', error)
  //   }
  // }

  async function logout() {
    setLoginorSignup("")
    setToken(undefined)
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
