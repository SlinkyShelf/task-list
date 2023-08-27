import "./ListPage.scss"
import store from "../../modules/store"

import { readPath, ConvertListsPath, getListName } from "../../modules/helpers"
import { useEffect, useState } from "react"

import ActionMenu from "../../components/ActionMenu/ActionMenu"

import { createStore } from "state-pool"

const listPageStore = createStore();
listPageStore.setState("action-menu", {
    "path": "",
    "pos": {"x": 0, "y": 0},
    "type": "header",
    "open": false
})

function TaskTab({task, path, toggleTask})
{
    return <div className="ListPage-Task">
        <div className="ListPage-Task-Title">
            <div className="ListPage-CheckBox mr-r" onClick={() => {
                toggleTask(path)
            }}>{task.completed && <div className="List-Page-CheckBox-Done"/>}</div>
            {task.title}
        </div>
    </div>
}

function ListPage()
{
    const [firebaseUserData, setFirebaseUserData] = store.useState("firebase-user-data")
    const [currentPage, setCurrentPage] = store.useState("current-page")
    const [listPath, setListPath] = store.useState("list-path")
    const [editPath, setEditPath] = store.useState("list-edit-path")
    const [tasks, setTasks] = useState({})

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

    const menuOptions = {
        // "task": {
        //     "Add Subtask": () => {

        //     }
        // },
        "header": {
            "New Task": () => {

            }
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
                if (_list.tags[tag])
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
            <span>{listTitle}</span>
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