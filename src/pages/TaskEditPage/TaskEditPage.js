import "./TaskEditPage.scss"
import store from "../../modules/store"

import { ConvertListsPath, readPath, getListName } from "../../modules/helpers"
import { useEffect, useState } from "react"

function TaskEditPage()
{
    const [editPath, setEditPath] = store.useState("task-edit-path")
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
        
        const {data, setData, target: _task} = readPath(editPath, drives)

        _task.name = editTitle
        setTitle(editTitle)
        setEditingTitle(false)

        setData(data)
    }

    function toggleTag(tag)
    {
        const {data, setData, target: _task} = readPath(editPath, drives)
        _task.tags[tag] = !_task.tags[tag]
        setData(data)
    }

    useEffect(() => {
        const {data, setData, target} = readPath(editPath, drives)

        setTitle(target.name)
        setEditTitle(target.name)
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
        
        <div>
            <div className="List-Edit-Tags-Container">
                {Object.keys(firebaseUserData.tags).map((tag) => {
                    const tagD = firebaseUserData.tags[tag]
                    return <div className="List-Edit-Tag mr-h" onClick={() => toggleTag(tag)} key={tag}>
                        <div className="List-Edit-Tag-Color mr-h" style={{backgroundColor: tagD.color}}/>
                        <div className="List-Edit-Tag-Name">{tagD.name}</div>
                        {listData.tags && listData.tags[tag] && <div className="icon-check right"/>}
                    </div>
                })}
            </div>
        </div>
    </div>
}

export default TaskEditPage