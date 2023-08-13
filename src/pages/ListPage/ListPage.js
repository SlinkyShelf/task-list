import "./ListPage.scss"
import store from "../../modules/store"

function safePath(obj, path, end)
{
    const paths = path.split(".")
    const emptyObj = {}

    paths.map((p) => {
        obj = obj[p] || emptyObj
    })

    if (end && (obj == emptyObj || typeof(obj) != typeof(end)))
        return end

    return obj
}

function ListPage()
{
    const [userData] = store.useState("firebase-user-data")

    return <div className="ListPage">
        {safePath(userData, "lists", []).map()}
    </div>
}

export default ListPage