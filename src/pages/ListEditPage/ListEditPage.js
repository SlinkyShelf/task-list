import "./ListEditPage.scss"
import store from "../../modules/store"

import { ConvertListsPath, readPath, getListName } from "../../modules/helpers"
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

        const actualPath = ConvertListsPath(parentPath)

        const {data, setData, target} = readPath(actualPath, drives)

        const list = target.lists[title]

        if (target.lists[editTitle] == list)
        {
            setEditingTitle(false)
            return
        }

        if (target.lists[editTitle])
        {
            return console.log("Title already exists")
        }

        delete target.lists[title]
        target.lists[editTitle] = list

        setTitle(editTitle)
        setEditingTitle(false)

        setData(data)
    }

    useEffect(() => {
        const {data, setData, target} = readPath(ConvertListsPath(editPath), drives)
        let ListName = getListName(editPath)

        setTitle(ListName)
        setEditTitle(ListName)
        setListData(target)
    }, [])

    return <div className="List-Edit">
        <div className="List-Edit-Header">
            Edit
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