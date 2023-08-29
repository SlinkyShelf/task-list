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

    function toggleTag(tag)
    {
        const {data, setData, target: _list} = readPath(ConvertListsPath(editPath), drives)
        _list.tags[tag] = !_list.tags[tag]
        setData(data)
    }

    useEffect(() => {
        const {data, setData, target} = readPath(ConvertListsPath(editPath), drives)
        let ListName = getListName(editPath)

        setTitle(ListName)
        setEditTitle(ListName)
        setListData(target)
    }, [firebaseUserData])

    return <div className="List-Edit">
        <div className="Title-Tab">
            Edit
            <div className="icon-back left" onClick={() => setCurrentPage("all-lists")}/>
        </div>
        <div className="List-Edit-Title-Label">Title</div>
        <div className="List-Edit-Title-Container">
            {editingTitle && <>
                <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="List-Edit-Title-Input"/>
                <div className="icon-check" onClick={UpdateName}/>
            </>}
            {!editingTitle && <>
                <div className="List-Edit-Title">{title}</div>
                <div className="icon-edit" onClick={() => setEditingTitle(true)}/>
            </>}
        </div>
        
        {listData.type == "list" && <div>
            <div className="List-Edit-Tags-Container">
                {Object.keys(firebaseUserData.tags).map((tag) => {
                    const tagD = firebaseUserData.tags[tag]
                    return <div className="List-Edit-Tag mr-h" onClick={() => toggleTag(tag)} key={tag}>
                        <div className="List-Edit-Tag-Color mr-h" style={{backgroundColor: tagD.color}}/>
                        <div className="List-Edit-Tag-Name">{tagD.name}</div>
                        {listData.tags[tag] && <div className="icon-check right"/>}
                    </div>
                })}
            </div>
        </div>}
    </div>
}

export default ListEditPage