import { useState, useEffect } from "react";
import {useAuthState} from "react-firebase-hooks/auth"
import { auth } from "./modules/firebase-auth.js";
import "./scss/theme.scss"

import SignInPage from "./pages/SignInPage";
import {app, db} from "./modules/firebase-auth.js"

import Footer from "./components/Footer.js";

function MainContent({user})
{
  return <>
    <Footer user={user}/>
  </>
}

function App() {
  const [user] = useAuthState(auth);
  console.log(user)

  return (
    <div className="App">
      {(user == undefined) && <SignInPage/>}
      {user && <MainContent user={user}/>}
    </div>
  );
}

export default App;
