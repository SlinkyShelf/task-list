import { getAuth, GoogleAuthProvider, signInWithRedirect , browserPopupRedirectResolver  } from "firebase/auth";
import "./SignInPage.scss"
import { auth } from "../../modules/firebase-auth";

function SignIn()
{
    const provider = new GoogleAuthProvider()
    signInWithRedirect(auth, provider, browserPopupRedirectResolver)
}

function SignInPage()
{
    return <div className="SignInPage">
        <div className="SignInPage-Button" onClick={SignIn}>Sign In</div>
    </div>
}

export default SignInPage