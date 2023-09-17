import "./ListPage.scss"
import store from "../../modules/store"

import { ConvertListsPath, getListName, createId, findName } from "../../modules/helpers"
import { useEffect, useState } from "react"

import { ActionMenu, ActionMenuState } from "../../components/ActionMenu/ActionMenu"
import { getTouchPos } from "../../modules/helpers"
import useLongPress from "../../modules/long-press"
import TaskTab from "../../components/TaskTab/TaskTab"

import { createStore } from "state-pool"
import { useGlobalData } from "../../modules/data-handler"

const listPageStore = createStore();
listPageStore.setState("action-menu", ActionMenuState())
listPageStore.setState("renaming", "")

function ListPage()
{
    const [currentPage, setCurrentPage] = store.useState("current-page")
    const [listPath, setListPath] = store.useState("list-path")
    const [editPath, setEditPath] = store.useState("list-edit-path")
    const [taskEditPath, setTaskEditPath ] = store.useState("task-edit-path")
    const [tasks, setTasks] = useState({})

    const [renaming, setRenaming] = listPageStore.useState("renaming")
    const [actionMenu, setActionMenu] = listPageStore.useState("action-menu")

    const [listTitle, setListTitle] = useState("")
    const [list, setList] = useState({})

    const { readData, dataUpdates } = useGlobalData()

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
        let {data, setData, target: _list} = readData(ConvertListsPath(listPath))

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

    useEffect(() => {
        let {data, setData, target: _list} = readData(ConvertListsPath(listPath))
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
    }, [listPath, ...dataUpdates])

    return <div className="ListPage">
        <ActionMenu state={actionMenu} setState={setActionMenu} options={menuOptions}/>
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
                path={"Firebase.tasks."+key} pageStore={listPageStore}/>
            })}
        </div>
    </div>
}

export default ListPage