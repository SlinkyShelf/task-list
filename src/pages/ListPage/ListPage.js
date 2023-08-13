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

function ListTab({list, listName})
{
    return <>
        {list.type == "folder" && <div>
            {listName}
        </div>}
        {list.type == "folder" && <div>
        {listName}
        </div>}
    </>
}

function ListPage()
{
    const [userData] = store.useState("firebase-user-data")

    return <div className="ListPage">
        {Object.keys(safePath(userData, "lists")).map((listName) => {
            console.log(listName)
            return <ListTab listName={listName} list={userData[listName]}/>
        })}
    </div>
}

export default ListPage