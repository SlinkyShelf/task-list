import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, app, db } from "./modules/firebase-auth.js";
import "./scss/index.scss"
import "./scss/theme.scss"
import "./scss/positions.scss"
import "./scss/icons.scss"
import "./scss/components.scss"

import store from "./modules/store.js"
import FirebaseStore from "./modules/firebase-store.js";

import Footer from "./components/Footer/Footer.js";
// import SignInPage from "./pages/SignInPage/SignInPage.js";
// import AllListsPage from "./pages/AllListsPage/AllListsPage.js";
// import ListEditPage from "./pages/ListEditPage/ListEditPage.js";
// import TaskEditPage from "./pages/TaskEditPage/TaskEditPage.js";
// import ListPage from "./pages/ListPage/ListPage.js";
// import TagsPage from "./pages/TagsPage/TagsPage.js";
// import SettingsPage from "./pages/SettingsPage/SettingsPage.js";
// import CalendarPage from "./pages/CalendarPage/CalendarPage.js";

import FramesPage from "./pages/FramesPage/FramesPage.js";

import VersionTag from "./components/VersionTag/VersionTag.js";

import {defaultUserData, objClone} from "./modules/default-data.js";
import LocalStore from "./modules/local-store.js";
import { rawClone } from "./modules/data-handler.js";

store.setState("firebase-user-data", objClone(defaultUserData))
store.setState("local-user-data", objClone(defaultUserData))

store.setState("list-edit-path", "")
store.setState("list-path", "")

store.setState("task-edit-path")
store.setState("user", null)

function MainContent({ user }) {
  
  return <>
    <div className="anti-footer">
      <FramesPage/>
      {/* {currentPage == "all-lists"   && <AllListsPage/>}
      {currentPage == "list-edit" && <ListEditPage/>}
      {currentPage == "list" && <ListPage/>}
      {currentPage == "tags" && <TagsPage/>}
      {currentPage == "task-edit" && <TaskEditPage />}
      {currentPage == "settings" && <SettingsPage user={user} />}
      {currentPage == "calendar" && <CalendarPage/>}
      {currentPage == "frames" && <CalendarPage/>} */}
    </div>
    <Footer/>
  </>
}

function App() {
  const [user] = useAuthState(auth);
  const [stateUser, setStateUser ] = store.useState("user")

  useEffect(() => {
    setStateUser(user)
  }, [user])

  return (
    <div className="App">
      <LocalStore storename={"local-user-data"} docName={"user-data"}/>
      {user && <FirebaseStore coll="users" 
        docName={user.uid} 
        storename={"firebase-user-data"} 
        defData={objClone(defaultUserData)}/>
        }
      
      {/* {(user == undefined) && <SignInPage />} */}
      {/* {user && <MainContent user={user} />} */}
      <MainContent/>
      <VersionTag/>
    </div>
  );
}

export default App;
