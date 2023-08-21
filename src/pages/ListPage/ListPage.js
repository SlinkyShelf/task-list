import "./ListPage.scss"
import store from "../../modules/store"
import { useEffect, useState, useRef } from "react"

import useLongPress from "../../modules/long-press";

import {createStore } from 'state-pool';
import { readPath, ConvertListsPath, getListName, getParentPath, safePath } from "../../modules/helpers";

const listPageStore = createStore();
listPageStore.setState("action-menu", {
    "path": "",
    "pos": {"x": 0, "y": 0},
    "type": "folder",
    "open": false
})

const defaultOptions = {
    shouldPreventDefault: true,
    delay: 500,
};

const colorDepth = ["red", "green", "blue", "orange"]

function getTouchPos(e)
{
    if (e.touches)
        return {"x": e.touches[0].clientX, "y": e.touches[0].clientY}
    return {"x": e.ClientX, "y": e.ClientY}
}

function ActionMenu({Options, open, setOpen, style})
{
    const ref = useRef()

    useEffect(() => {
        function outsideClick(e)
        {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false)
            }
        }

        document.addEventListener("pointerdown", outsideClick)

        return () => {
            document.removeEventListener("pointerdown", outsideClick);
          };
    }, [])

    return (open && <div className="List-Page-Action-Menu" ref={ref} style={style}>
        {Object.keys(Options).map((key) => {
            return <div className="List-Page-Action-Menu-Option" key={key} onClick={(e) => {
                setOpen(false)
                Options[key]()
                e.preventDefault()
            }}>
                {key}
            </div>
        })}
    </div>)
}

function FindName(list, defaultName)
{
    if (!list[defaultName])
        return defaultName

    let newName = defaultName

    let int = 1
    while (list[newName])
    {
        newName = defaultName + " " + int
        int += 1
    }

    return newName
}

function ListTab({list, listName, depth, path})
{
    depth = depth || 0
    const [open, setOpen] = useState(false)
    const [actionMenu, setActionMenu] = listPageStore.useState("action-menu")

    const longPressEvent = useLongPress(
        (e) => {
            const menu = {...actionMenu}
            menu.type = list.type
            menu.path = path
            menu.open = true
            menu.pos = getTouchPos(e)
            setActionMenu(menu)
        }, 
        () => {
            setOpen(!open)
        }, defaultOptions);

    return <div className="List-Page-Tab-Container">
        {list.type == "folder" && <div className="List-Page-Folder List-Page-Tab">
            <div className="List-Page-Title" {...longPressEvent}>
                <div className="List-Page-Tab-Folder-Icon" />
                {listName}
                {depth > 0 &&  <div className="Down-Line-Side"/>}
            </div>
            {open && <div className="List-Page-Folder-List">
                {Object.keys(list.lists).map((lName) => {
                    return <ListTab list={list.lists[lName]} listName={lName} 
                    key={lName} depth={depth+1} path={`${path}.${lName}`}/>
                })}
            </div>}
            <div className="Down-Line-Up-Test"/>
        </div>}

        {list.type == "list" && <div>
            <div className="List-Page-List List-Page-Tab" {...longPressEvent}>
                {listName}
                {depth > 0 &&  <div className="Down-Line-Side"/>}
                {depth > 0 &&  <div className="Down-Line-Up"/>}
            </div>
        </div>}
    </div>
}

function SourceTab({source})
{
    const [actionMenu, setActionMenu] = listPageStore.useState("action-menu")

    const longPressEvent = useLongPress(
        (e) => {
            const menu = {...actionMenu}
            menu.type = "base"
            menu.path = source
            menu.open = true
            menu.pos = getTouchPos(e)
            setActionMenu(menu)
        },  
        () => {
            // setOpen(!open)
        }, defaultOptions);

    return <div className="List-Page-Source-Tab" {...longPressEvent}>
        {source}
        <div className="bottom-border"/>
    </div>
}

function ListPage()
{
    const [firebaseUserData, setFirebaseUserData] = store.useState("firebase-user-data")
    const [currentPage, setCurrentPage] = store.useState("current-page")
    const [editPath, setEditPath] = store.useState("list-edit-path")
    const [actionMenu, setActionMenu] = listPageStore.useState("action-menu")

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

    function create(d)
    {
        let {data, setData, target} = readPath(ConvertListsPath(actionMenu.path), drives)

        const listName = FindName(target.lists, "Untitled")

        target.lists[listName] = d
        setData(data)
        setEditPath(`${actionMenu.path}.${listName}`)
        setCurrentPage("list-edit")
    }   

    function CreateList()
    {
        create({
            "type": "list",
            "tags": {}
        })
    }

    function CreateFolder()
    {
        create({
            "type": "folder",
            "lists": {}
        })
    }

    function Delete()
    {
        const actualPath = ConvertListsPath(getParentPath(actionMenu.path))
        const {data, setData, target} = readPath(actualPath, drives)
        delete target.lists[getListName(actionMenu.path)]
        setData(data)
    }

    const defaultOptions = {
        "Cancel": () => openActionMenu(false)
    }

    const editOptions = {
        "Edit": () => {
            setEditPath(actionMenu.path)
            setCurrentPage("list-edit")
        },
        "Delete": Delete,
    }

    const createOptions = {
        "New Folder": CreateFolder,
        "New List": CreateList,
    }

    const menuOptions = {
        "base": {...createOptions, ...defaultOptions},
        "folder": {...createOptions, ...editOptions, ...defaultOptions},
        "list": {...editOptions, ...defaultOptions}
    }

    return <div className="ListPage">
        <ActionMenu style={{"left": actionMenu.pos.x+"px", "top": actionMenu.pos.y+"px"}} 
            open={actionMenu.open} setOpen={openActionMenu} Options={menuOptions[actionMenu.type]}/>
        <SourceTab source={"Firebase"}/>
        <div className="List-Page-List-Table">
            {Object.keys(safePath(firebaseUserData, "lists")).map((listName) => {
                return <ListTab listName={listName} list={firebaseUserData.lists[listName]} key={listName} 
                path={`Firebase.${listName}`}/>
            })}
        </div>
    </div>
}

export default ListPage