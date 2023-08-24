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
    "type": "folder",
    "open": false
})

function TaskTab({task})
{
    return <div className="ListPage-Task">
        <div className="List-Page-Task-Title">
            <div className="List-Page-CheckBox">{task.completed && <div className="List-Page-CheckBox-Done"/>}</div>
            {task.title}
        </div>
        <div className="ListPage-Task-SubTasks">
            {/* {task.subtasks.map((task, i) => {
                return <TaskTab task={task} key={i}/>
            })} */}
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
        "folder": {

        }
    }

    useEffect(() => {
        let {data, setData, target: _list} = readPath(ConvertListsPath(listPath), drives)
        setList(_list)

        console.log(_list)

        const newTasks = {}
        Object.keys(data.tasks).map((key) => {
            console.log("Task: "+key)
            const task = data.tasks[key]

            let valid = false

            Object.keys(task.tags).map((tag) => {
                console.log("Task Tags: "+tag, _list.tags[tag])
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
            {listTitle}
            <div className="icon-back left style-tint" onClick={() => setCurrentPage("all-lists")}/>
            <div className="icon-edit right style-tint" onClick={() => {
                setEditPath(listPath)
                setCurrentPage("list-edit")
                }}/>
        </div>

        <div className="ListPage-List">
            {Object.keys(tasks).map((key) => {
                return <TaskTab task={tasks[key].task} key={key}/>
            })}
        </div>
    </div>
}

export default ListPage