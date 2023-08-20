import "./ListEditPage.scss"
import store from "../../modules/store"

import { ConvertListsPath, readPath } from "../../modules/helpers"
import { useEffect, useState } from "react"

function ListEditPage()
{
    const [editPath, setEditPath] = store.useState("list-edit-path")
    const [firebaseUserData, setFirebaseUserData] = store.useState("firebase-user-data")

    const drives = {
        "Firebase": {
            "data": firebaseUserData,
            "setData": setFirebaseUserData
        }
    }

    const [title, setTitle] = useState("")
    const [editTitle, setEditTitle] = useState("")
    const [editingTitle, setEditingTitle] = useState(false)
    const [ listData, setListData ] = useState({})
    const [currentPage, setCurrentPage] = store.useState("current-page")

    function UpdateData(callback)
    {
        
    }

    function UpdateName()
    {
        let parentPath
        if (editPath.indexOf(".") != -1)
            parentPath = editPath.substring(0, editPath.lastIndexOf("."))
        else   
            parentPath = editPath.split(":")[0]+":"

        console.log(parentPath)
        const actualPath = ConvertListsPath(parentPath)

        const {data, setData, target} = readPath(actualPath, drives)

        if (target.lists[editTitle])
        {
            return console.log("Title already exists")
        }

        const list = target.lists[title]
        delete target.lists[title]
        target.lists[editTitle] = list

        console.log(data, target)

        setTitle(editTitle)
        setEditingTitle(false)

        setData(data)
    }

    useEffect(() => {
        const pathSplit = editPath.split(".")
        const actualPath = ConvertListsPath(editPath)

        const {data, setData, target} = readPath(actualPath, drives)

        let ListName = pathSplit[pathSplit.length-1]
        ListName = ListName.substring(ListName.indexOf(":")+1)
        console.log("ListName: "+ListName)

        setTitle(ListName)
        setEditTitle(ListName)
        setListData(target)
    }, [])

    return <div className="List-Edit">
        <div className="List-Edit-Header">
            Create/Edit
            <div className="List-Edit-Back" onClick={() => setCurrentPage("list")}/>
        </div>
        <div className="List-Edit-Title-Label">Title</div>
        <div className="List-Edit-Title-Container">
            {editingTitle && <>
                <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="List-Edit-Title-Input"/>
                <div className="List-Edit-Check" onClick={UpdateName}/>
            </>}
            {!editingTitle && <>
                <div className="List-Edit-Title">{title}</div>
                <div className="List-Edit-Edit" onClick={() => setEditingTitle(true)}/>
            </>}
        </div>
    </div>
}

export default ListEditPage