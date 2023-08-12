import { useState, useEffect } from "react";
import {useAuthState} from "react-firebase-hooks/auth"
import { auth } from "./modules/firebase-auth.js";
import "./scss/theme.scss"

import SignInPage from "./pages/SignInPage";
import {app, db} from "./modules/firebase-auth.js"


function App() {
  const [user] = useAuthState(auth);
  console.log(user)

  return (
    <div className="App">
      {(user == undefined) && <SignInPage/>}
    </div>
  );
}

export default App;
