import { auth } from "../../modules/firebase-auth";
import { signOut } from "firebase/auth";
import "./SettingsPage.scss"

import store from "../../modules/store";

import defaultFirebaseData from "../../modules/default-firebase-data";

function SettingsPage({user})
{
    const [firebaseUserData, setFirebaseUserData] = store.useState("firebase-user-data")

    return <div className="SettingsPage">
        <div className="Title-Tab">Settings</div>

        <div className="SettingsPage-Section">
            <div className="SettingsPage-Header">Account</div>
            <div className="SettingsPage-Line">
                <div className="SettingsPage-Info-1">{user.displayName}</div>
                <div className="SettingsPage-Button-1" onClick={() => signOut(auth)}>Sign Out</div>
            </div>
            <div className="SettingsPage-Button-1" 
                onClick={() => setFirebaseUserData({...defaultFirebaseData})}>Reset Data</div>
        </div>
    </div>
}

export default SettingsPage