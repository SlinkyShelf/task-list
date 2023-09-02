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

import VersionTag from "./components/VersionTag/VersionTag.js";

import defaultFirebaseData from "./modules/default-firebase-data.js";

// Pages: list, edit, settings, new-task
store.setState("current-page", "all-lists")
store.setState("firebase-user-data", {...defaultFirebaseData})

store.setState("list-edit-path", "")
store.setState("list-path", "")

store.setState("task-edit-path")

function MainContent({ user }) {
  const [currentPage] = store.useState("current-page")
  
  return <>
    <FirebaseStore coll="users" docName={user.uid} storename={"firebase-user-data"} def={{...defaultFirebaseData}}/>

    {currentPage == "all-lists"   && <AllListsPage/>}
    {currentPage == "list-edit" && <ListEditPage/>}
    {currentPage == "list" && <ListPage/>}
    {currentPage == "tags" && <TagsPage/>}
    {currentPage == "task-edit" && <TaskEditPage />}
    <Footer user={user} />
  </>
}

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      {(user == undefined) && <SignInPage />}
      {user && <MainContent user={user} />}
      <VersionTag/>
    </div>
  );
}

export default App;
