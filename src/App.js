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
import SignInPage from "./pages/SignInPage/SignInPage.js";
import AllListsPage from "./pages/AllListsPage/AllListsPage.js";
import ListEditPage from "./pages/ListEditPage/ListEditPage.js";
import TaskEditPage from "./pages/TaskEditPage/TaskEditPage.js";
import ListPage from "./pages/ListPage/ListPage.js";
import TagsPage from "./pages/TagsPage/TagsPage.js";
import SettingsPage from "./pages/SettingsPage/SettingsPage.js";
import CalendarPage from "./pages/CalendarPage/CalendarPage.js";

import VersionTag from "./components/VersionTag/VersionTag.js";

import defaultUserData from "./modules/default-user-data.js";
import LocalStore from "./modules/local-store.js";
import { rawClone } from "./modules/data-handler.js";

// Pages: list, edit, settings, new-task
store.setState("current-page", "all-lists")
// store.setState("firebase-user-data", {...defaultUserData})
store.setState("user-data", rawClone(defaultUserData))

store.setState("list-edit-path", "")
store.setState("list-path", "")

store.setState("task-edit-path")

function MainContent({ user }) {
  const [currentPage] = store.useState("current-page")
  
  return <>
    {/* <FirebaseStore coll="users" docName={user.uid} storename={"firebase-user-data"} def={{...defaultFirebaseData}}/> */}
    <div className="anti-footer">
      {currentPage == "all-lists"   && <AllListsPage/>}
      {currentPage == "list-edit" && <ListEditPage/>}
      {currentPage == "list" && <ListPage/>}
      {currentPage == "tags" && <TagsPage/>}
      {currentPage == "task-edit" && <TaskEditPage />}
      {currentPage == "settings" && <SettingsPage user={user} />}
      {currentPage == "calendar" && <CalendarPage/>}
    </div>
    <Footer/>
  </>
}

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      {/* {(user == undefined) && <SignInPage />} */}
      {/* {user && <MainContent user={user} />} */}
      <MainContent/>
      <VersionTag/>
    </div>
  );
}

export default App;
