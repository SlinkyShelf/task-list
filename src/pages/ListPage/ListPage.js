import "./ListPage.scss"
import store from "../../modules/store"

const colorDepth = ["red", "green", "blue", "orange"]

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
        {list.type == "folder" && <div className="List-Page-Folder List-Page-Tab">
            <div className="List-Page-Title">{listName}</div>
            <div className="List-Page-Folder-List">
                {Object.keys(list.lists).map((lName) => {
                    return <ListTab list={list.lists[lName]} listName={lName} key={lName} />
                })}
            </div>
        </div>}

        {list.type == "list" && <div className="List-Page-List List-Page-Tab">
            {listName}
        </div>}

        <div className="Down-Line">
            <div className="Down-Line-Side"/>
            <div className="Down-Line-Up"/>
        </div>
    </>
}

function SourceTab({source})
{
    return <div className="List-Page-Source-Tab">
        {source}
        <div className="bottom-border"/>
    </div>
}

function ListPage()
{
    const [userData] = store.useState("firebase-user-data")

    return <div className="ListPage">
        <SourceTab source={"Firebase"}/>
        <div className="List-Page-List-Table">
            {Object.keys(safePath(userData, "lists")).map((listName) => {
                console.log(listName)
                return <ListTab listName={listName} list={userData.lists[listName]} key={listName}/>
            })}
        </div>
    </div>
}

export default ListPage