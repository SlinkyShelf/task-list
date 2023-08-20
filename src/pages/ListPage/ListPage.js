import "./ListPage.scss"
import store from "../../modules/store"
import { useEffect, useState, useRef } from "react"

import useLongPress from "../../modules/long-press";

import {createStore } from 'state-pool';
import { readPath, ConvertListsPath, getListName } from "../../modules/helpers";

const listPageStore = createStore();
listPageStore.setState("action-menu", {
    "path": "",
    "pos": {"x": 0, "y": 0},
    "type": "folder",
    "open": false
})

const colorDepth = ["red", "green", "blue", "orange"]

function safePath(obj, path, end)
{
    const paths = path.split(".")
    const emptyObj = {}

    paths.map((p) => {
        obj = obj[p] || emptyObj
    })

    if (end && (obj == emptyObj || typeof(obj) != typeof(end)))
        return end

    return obj
}

function ActionMenu({Options, open, setOpen})
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

    return (open && <div className="List-Page-Action-Menu" ref={ref} onBlur={() => console.log("Test")}>
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

    const longPressEvent = useLongPress(
        () => {
            setActionMenu(true)
        }, 
        () => {
            setOpen(!open)
        }, defaultOptions);

    return <div className="List-Page-Tab-Container">
        {/* <ActionMenu open={actionMenu} setOpen={setActionMenu} Options={{
                    "New List": CreateList,
                    "New Folder": CreateFolder,
                    ...combinedOptions
                }}/> */}
        {list.type == "folder" && <div className="List-Page-Folder List-Page-Tab">
        {/* onClick={() => setOpen(!open)} onHold={() => setCreateMenu(true) */}
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
                {/* {createType != null && <NewItem type={createType} path={path}/>} */}
            </div>}
            <div className="Down-Line-Up-Test"/>
        </div>}

        {list.type == "list" && <div>
            {/* <div className="List-Page-Tab-List-Icon" /> */}
            <div className="List-Page-List List-Page-Tab" {...longPressEvent}>
                {listName}
                {depth > 0 &&  <div className="Down-Line-Side"/>}
                {depth > 0 &&  <div className="Down-Line-Up"/>}
            </div>
            {/* <ActionMenu open={actionMenu} setOpen={setActionMenu} Options={{
                    ...combinedOptions
                }}/> */}
        </div>}
    </div>
}

function SourceTab({source})
{
    return <div className="List-Page-Source-Tab">
        {source}
        <div className="bottom-border"/>
    </div>
}

function ListPage()
{
    const [firebaseUserData, setFirebaseUserData] = store.useState("firebase-user-data")
    const [currentPage, setCurrentPage] = store.useState("current-page")
    const [editPath, setEditPath] = store.useState("list-edit-path")

    const drives = {
        "Firebase": {
            "data": firebaseUserData,
            "setData": setFirebaseUserData
        }
    }



    function create(d)
    {
        let {data, setData, target} = readPath(ConvertListsPath(path), drives)

        const listName = FindName(target.lists, "Untitled")

        target.lists[listName] = d
        setData(data)
        setEditPath(`${path}.${listName}`)
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
        let parentPath
        if (path.indexOf(".") != -1)
            parentPath = path.substring(0, path.lastIndexOf("."))
        else   
            parentPath = path.split(":")[0]+":"

        const actualPath = ConvertListsPath(parentPath)

        const {data, setData, target} = readPath(actualPath, drives)

        
        let ListName = getListName(path)

        delete target.lists[ListName]

        console.log(data)

        setData(data)
    }
    

    const defaultOptions = {
        shouldPreventDefault: true,
        delay: 500,
    };

    const longPressEvent = useLongPress(
        () => {
            setActionMenu(true)
        }, 
        () => {
            setOpen(!open)
        }, defaultOptions);

    const combinedOptions = {
        "Edit": () => {
            setEditPath(path)
            setCurrentPage("list-edit")
        },
        "Delete": Delete,
        "Cancel": () => setActionMenu(false)
    }

    const [actionMenu, setActionMenu] = listPageStore.useState("action-menu")

    function openActionMenu(toggle)
    {
        const menu = {...actionMenu}
        actionMenu.open = 
    }

    return <div className="ListPage">
        <ActionMenu style={{"left": actionMenu.pos.x, "top": actionMenu.pos.y}} 
            open={actionMenu.open} setOpen={setActionMenu} Options={{
            ...combinedOptions
        }}/>
        <SourceTab source={"Firebase"}/>
        <div className="List-Page-List-Table">
            {Object.keys(safePath(firebaseUserData, "lists")).map((listName) => {
                return <ListTab listName={listName} list={userData.lists[listName]} key={listName} 
                path={`Firebase:${listName}`}/>
            })}
        </div>
    </div>
}

export default ListPage