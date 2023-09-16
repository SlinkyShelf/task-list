import "./TaskEditPage.scss"
import store from "../../modules/store"

import { ConvertListsPath, readPath, getListName } from "../../modules/helpers"
import { useEffect, useState } from "react"
import { dateFormatter } from "../../modules/helpers"
import { Timestamp } from "firebase/firestore"

function convertDate(date)
{
    var d = date,
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

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

    const [hasDate, setHasDate] = useState(false)
    const [taskDate, setTaskDate] = useState(Timestamp.fromDate(new Date()))

    function changeDate(newDate)
    {
        newDate = Timestamp.fromDate(new Date(newDate))
        const {data, setData, target} = readPath(editPath, drives)

        setTaskDate(newDate)
        target.date = newDate
        setData(data)
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

    function toggleHasDate()
    {
        console.log("Toggle state")

        setHasDate(!hasDate)
        const {data, setData, target} = readPath(editPath, drives)
        target.hasDate = !hasDate
        setData(data)
    }

    useEffect(() => {
        console.log(editPath)
        const {data, setData, target} = readPath(editPath, drives)

        setTitle(target.name)
        setEditTitle(target.name)

        const date = target.date?new Timestamp(target.date.seconds, target.date.nanoseconds):null

        setTaskDate(date)
        setHasDate(target.hasDate)
        setListData(target)
    }, [firebaseUserData])

    return <div className="List-Edit center">
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

        <div className="Section">
            <div className="Section-Header">Date</div>
            <div className="Section-Line">
                <div className="Section-Info-1">Has Date?</div>
                <div className="Section-CheckBox" onClick={toggleHasDate}>
                    <div className="Section-CheckBox-Check" 
                        style={{display: hasDate?"block":"none"}}/>
                </div>
            </div>
            <input type="date" className={`Section-Date ${hasDate?"":"unactive"}`} 
                value={convertDate((taskDate || Timestamp.fromDate(new Date())).toDate())} onChange={(e) => changeDate(e.target.value)}/>
        </div>
    </div>
}

export default TaskEditPage