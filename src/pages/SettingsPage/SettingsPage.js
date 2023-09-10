import { auth } from "../../modules/firebase-auth";
import { signOut } from "firebase/auth";
import "./SettingsPage.scss"

import store from "../../modules/store";

import defaultFirebaseData from "../../modules/default-firebase-data";

function SettingsPage({user})
{
    const [firebaseUserData, setFirebaseUserData] = store.useState("firebase-user-data")
    const [currentPage, setCurrentPage] = store.useState("current-page")

    return <div className="SettingsPage">
        <div className="Title-Tab">Settings</div>

        {/* Account Section */}
        <div className="Section">
            <div className="Section-Header">Account</div>
            <div className="Section-Line">
                <div className="Section-Info-1">{user.displayName}</div>
                <div className="Section-Button-1" onClick={() => signOut(auth)}>Sign Out</div>
            </div>
            <div className="Section-Button-1" 
                onClick={() => setFirebaseUserData({...defaultFirebaseData})}>Reset Data</div>
        </div>

        {/* Tags */}
        <div className="Section">
            <div className="Section-Header">Tags</div>
            <div className="Section-Line">
                <div className="Section-Info-1">Tag Count</div>
                <div className="Section-Info-1">{Object.keys(firebaseUserData.tags || {}).length}</div>
            </div>
            <div className="Section-Button-1" 
                onClick={() => setCurrentPage("tags")}>Edit Tags</div>
        </div>
    </div>
}

export default SettingsPage