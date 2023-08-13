import { useState, useEffect } from "react";
import {useAuthState} from "react-firebase-hooks/auth"
import { auth } from "./modules/firebase-auth.js";
import "./index.scss"
import "./theme.scss"

import SignInPage from "./pages/SignInPage/SignInPage.js";
import {app, db} from "./modules/firebase-auth.js"

import Footer from "./components/Footer/Footer.js";

function MainContent({user})
{
  return <>

    <Footer user={user}/>
  </>
}

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      {(user == undefined) && <SignInPage/>}
      {user && <MainContent user={user}/>}
    </div>
  );
}

export default App;
