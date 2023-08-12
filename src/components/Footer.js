import "../scss/Components/Footer.scss"

function Footer({user})
{
    return <div className="Footer">
        {user.displayName}
    </div>
}

export default Footer