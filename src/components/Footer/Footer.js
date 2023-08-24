import { auth } from "../../modules/firebase-auth";
import { signOut } from "firebase/auth";
import "./Footer.scss"

import store from "../../modules/store";

import defaultFirebaseData from "../../modules/default-firebase-data";

function Footer({user})
{
    const [firebaseUserData, setFirebaseUserData] = store.useState("firebase-user-data")

    return <div className="Footer">
        <span onClick={() => signOut(auth)}>{user.displayName}</span>
        <span onClick={() => setFirebaseUserData({...defaultFirebaseData})}>RESET DATA</span>
    </div>
}

export default Footer