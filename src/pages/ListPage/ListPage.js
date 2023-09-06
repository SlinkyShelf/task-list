import "./ListPage.scss"
import store from "../../modules/store"

import { readPath, ConvertListsPath, getListName, createId, findName } from "../../modules/helpers"
import { useEffect, useState } from "react"

import ActionMenu from "../../components/ActionMenu/ActionMenu"
import { getTouchPos } from "../../modules/helpers"
import useLongPress from "../../modules/long-press"

import { createStore } from "state-pool"

const listPageStore = createStore();
listPageStore.setState("action-menu", {
    "task": "",
    "pos": {"x": 0, "y": 0},
    "type": "header",
    "open": false
})
listPageStore.setState("renaming", "")

function TaskTab({task, path, toggleTask})
{
    const [actionMenu, setActionMenu] = listPageStore.useState("action-menu")
    const [renaming, setRenaming] = listPageStore.useState("renaming")
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

function ListPage()
{
    const [firebaseUserData, setFirebaseUserData] = store.useState("firebase-user-data")
    const [currentPage, setCurrentPage] = store.useState("current-page")
    const [listPath, setListPath] = store.useState("list-path")
    const [editPath, setEditPath] = store.useState("list-edit-path")
    const [taskEditPath, setTaskEditPath ] = store.useState("task-edit-path")
    const [tasks, setTasks] = useState({})

    const [renaming, setRenaming] = listPageStore.useState("renaming")
    const [actionMenu, setActionMenu] = listPageStore.useState("action-menu")

    const [listTitle, setListTitle] = useState("")
    const [list, setList] = useState({})

    const drives = {
        "Firebase": {
            "data": firebaseUserData,
            "setData": setFirebaseUserData
        }
    }

    function openActionMenu(toggle)
    {
        const menu = {...actionMenu}
        menu.open = toggle
        setActionMenu(menu)
    }

    const longPressEvent = useLongPress(
        (e) => {
            const menu = {...actionMenu}
            menu.type = "header"
            menu.open = true
            menu.pos = getTouchPos(e)
            setActionMenu(menu)
        },  
        () => {});

    function newTask()
    {
        let {data, setData, target: _list} = readPath(ConvertListsPath(listPath), drives)

        const newTask = {
            "name": "New Task",
            "metadata": {},
            "tags": {..._list.tags}
        }

        const taskId = createId(data.tasks)
        data.tasks[taskId] = newTask
        setData(data)

    }

    const menuOptions = {
        "task": {
            "Rename": () => {
                setRenaming(actionMenu.task)
            },
            "Edit": () => {
                setTaskEditPath("Firebase.tasks."+actionMenu.task)
                setCurrentPage("task-edit")
            },
            "New Task": newTask
        },
        "header": {
            "New Task": newTask
        }
    }

    function toggleTask(path)
    {
        let {data, setData, target: task} = readPath(path, drives)
        task.completed = !task.completed
        setData(data)
    }

    useEffect(() => {
        let {data, setData, target: _list} = readPath(ConvertListsPath(listPath), drives)
        setList(_list)

        const newTasks = {}
        Object.keys(data.tasks).map((key) => {
            const task = data.tasks[key]

            let valid = false

            Object.keys(task.tags).map((tag) => {
                if (_list.tags[tag] && task.tags[tag])
                    valid = true
            })

            if (valid)
                newTasks[key] = task
        })
        setTasks(newTasks)

        setListTitle(getListName(listPath))
    }, [listPath, firebaseUserData])

    return <div className="ListPage">
        <ActionMenu pos={actionMenu.pos} 
            open={actionMenu.open} setOpen={openActionMenu} Options={menuOptions[actionMenu.type]}/>
        <div className="Title-Tab white-tint">
            <span {...longPressEvent}>{listTitle}</span>
            <div className="icon-back left style-tint" onClick={() => setCurrentPage("all-lists")}/>
            <div className="icon-edit right style-tint" onClick={() => {
                setEditPath(listPath)
                setCurrentPage("list-edit")
                }}/>
        </div>

        <div className="ListPage-List">
            {Object.keys(tasks).map((key) => {
                return <TaskTab task={tasks[key]} key={key} 
                path={"Firebase.tasks."+key} toggleTask={toggleTask}/>
            })}
        </div>
    </div>
}

export default ListPage