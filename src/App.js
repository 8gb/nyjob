import React, { Component, createContext } from "react";
import Home from './home'
import UserProvider from './UserProvider'


const App = () => (
    <UserProvider>
        <Home />
    </UserProvider>)

export default App;
