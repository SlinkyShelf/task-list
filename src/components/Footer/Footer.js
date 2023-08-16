import { auth } from "../../modules/firebase-auth";
import { signOut } from "firebase/auth";
import "./Footer.scss"

function Footer({user})
{
    return <div className="Footer" onClick={() => signOut(auth)}>
        {user.displayName}
    </div>
}

export default Footer