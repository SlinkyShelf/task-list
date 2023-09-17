import store from "../../modules/store"
import { useState, useEffect } from "react"
import { readPath, getListName, getTouchPos } from "../../modules/helpers"
import useLongPress from "../../modules/long-press"

function TaskTab({task, path, toggleTask, pageStore})
{
    const [actionMenu, setActionMenu] = pageStore.useState("action-menu")
    const [renaming, setRenaming] = pageStore.useState("renaming")
    const [firebaseUserData, setFirebaseUserData] = store.useState("firebase-user-data")

    const [ newName, setNewName ] = useState("")

    useEffect(() => {
        setNewName(task.name)
    }, [path])

    const drives = {
        "Firebase": {
            "data": firebaseUserData,
            "setData": setFirebaseUserData
        }
    }

    function changeName()
    {
        let {data, setData, target: _task} = readPath(path, drives)

        _task.name = newName;
        setData(data)

        setRenaming("")
    }

    const longPressEvent = useLongPress(
        (e) => {
            const menu = {...actionMenu}
            menu.type = "task"
            menu.open = true
            menu.pos = getTouchPos(e)
            menu.task = getListName(path)
            setActionMenu(menu)
        },  
        () => {}, {shouldPreventDefault: false});

    function isRenaming()
    {
        return renaming == getListName(path)
    }

    return <div className={`ListPage-Task ${isRenaming() && "renaming"}`} >
        <div className="ListPage-Task-Title" {...(!isRenaming() && longPressEvent)}>
            <div className="ListPage-CheckBox mr-h" onClick={(e) => {
                if (isRenaming())
                    return
                toggleTask(path)
                e.preventDefault()
            }}>{task.completed && <div className="List-Page-CheckBox-Done"/>}</div>
            {!isRenaming() && task.name}
            {isRenaming() && <div className="ListPage-task-Rename">
                <input type="text" className="ListPage-task-Rename-Input" 
                value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Task Name"/>
                <div className="icon-check" onClick={changeName}/>
            </div>}
        </div>
    </div>
}

export default TaskTab