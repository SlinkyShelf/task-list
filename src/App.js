import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, app, db } from "./modules/firebase-auth.js";
import Runner from "./DocumentTypes/Runner.js";
import "./scss/index.scss"
import "./scss/theme.scss"
import "./scss/positions.scss"
import "./scss/icons.scss"
import "./scss/components.scss"
import "./scss/sections.scss"

import store from "./modules/store.js"
import FirebaseStore from "./modules/firebase-store.js";

import Footer from "./components/Footer/Footer.js";

import AllPages from "./pages/all-pages.js";

import SignInPage from "./pages/SignInPage/SignInPage.js";
import FramesPage from "./pages/FramesPage/FramesPage.js";

import VersionTag from "./components/VersionTag/VersionTag.js";

import {defaultUserData, objClone} from "./modules/default-data.js";

store.setState("user-data", objClone(defaultUserData))
console.log(objClone(defaultUserData))
store.setState("user", null)
store.setState("pages", [])

function MainContent({ user }) {
  const [pages, setPages] = store.useState("pages")
  return <>
    {/* <div className="anti-footer"> */}
      <FramesPage/>
      {pages.map((page, i) => {
        const Page =  AllPages[page.type]
        return <Page {...page.attributes} key={i}/>
      })}
    {/* </div> */}
    {/* <Footer/> */}
  </>
}

function App() {
  const [user] = useAuthState(auth);
  const [stateUser, setStateUser ] = store.useState("user")

  useEffect(() => {
    // setStateUser(user)
  }, [user])

  return (
    <div className="App">
      {user && <FirebaseStore coll="users" 
        docName={user.uid} 
        storename={"user-data"} 
        defData={objClone(defaultUserData)}/>
        }
      
      {(user == undefined) && <SignInPage />}
      {user && <MainContent user={user} />}
      {/* <MainContent/> */}
      <VersionTag/>
    </div>
  );
}

export default App;
