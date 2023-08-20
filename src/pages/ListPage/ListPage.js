import "./ListPage.scss"
import store from "../../modules/store"
import { useEffect, useState, useRef } from "react"

import useLongPress from "../../modules/long-press";

import {createStore } from 'state-pool';

const listPageStore = createStore();
listPageStore.setState("selected-path", null)

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

function NewItem({type, create, unfocus})
{   
    const [ itemName, setItemName ] = useState("")

    const ref = useRef()

    useEffect(() => {
        function outsideClick(e)
        {
            if (ref.current && !ref.current.contains(e.target)) {
                create(itemName)
            }
        }

        document.addEventListener("pointerdown", outsideClick)

        return () => {
            document.removeEventListener("pointerdown", outsideClick);
          };
    }, [])

    return <div className="List-Page-New-Item">
        {type == "list" && <div className="List-Page-Tab-List-Icon New-Item-Icon"/>}
        {type == "folder" && <div className="List-Page-Tab-Folder-Icon New-Item-Icon"/>}


        <input type="text" className="List-Page-New-Item-Input" 
            value={itemName} onChange={(e) => setItemName(e.target.value)}/>
    </div>
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

function ListTab({list, listName, depth, path, setUserData, userData})
{
    depth = depth || 0
    const [open, setOpen] = useState(false)
    const [actionMenu, setActionMenu] = useState(false)

    const [currentPage, setCurrentPage] = store.useState("current-page")
    const [createType, setCreateType] = useState(null)
    const [editPath, setEditPath] = store.useState("edit-path")

    function edit(type)
    {
        // console.log("Create")
        // setCreateType(type)
        // setCreatePath(path)
        // setCurrentPage("create")
    }

    function CreateList()
    {
        let newData = JSON.parse(JSON.stringify(userData))
        let list = newData
        const splitPath = path.split(".")
        splitPath.map((p) => {
            list = list.lists[p]
        })
        console.log(list)

        const newList = {
            "type": "list",
            "tags": {}
        }

        list.lists[FindName(list.lists, "Untitled")] = newList
        setUserData(newData)
        setEditPath(`${path}.New-List`)
        setCurrentPage("edit")
    }

    function CreateFolder()
    {
        // setCreateType("folder")
        // setOpen(true)
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

    return <div className="List-Page-Tab-Container">
        {list.type == "folder" && <div className="List-Page-Folder List-Page-Tab">
        {/* onClick={() => setOpen(!open)} onHold={() => setCreateMenu(true) */}
            <div className="List-Page-Title" {...longPressEvent}>
                <div className="List-Page-Tab-Folder-Icon" />
                {listName}
                {depth > 0 &&  <div className="Down-Line-Side"/>}
            </div>
            <ActionMenu open={actionMenu} setOpen={setActionMenu} Options={{
                    "New List": CreateList,
                    "New Folder": CreateFolder,
                    "Edit": () => {
                        setEditPath(path)
                        setCurrentPage("edit")
                    },
                    "Delete": () => {},
                    "Cancel": () => setActionMenu(false)
                }}/>
            {open && <div className="List-Page-Folder-List">
                {Object.keys(list.lists).map((lName) => {
                    return <ListTab list={list.lists[lName]} listName={lName} 
                    key={lName} depth={depth+1} path={`${path}.${lName}`}
                    setUserData={setUserData} userData={userData}/>
                })}
                {/* {createType != null && <NewItem type={createType} path={path}/>} */}
            </div>}
            <div className="Down-Line-Up-Test"/>
        </div>}

        {list.type == "list" && <div className="List-Page-List List-Page-Tab">
            {/* <div className="List-Page-Tab-List-Icon" /> */}
            {listName}
            {depth > 0 &&  <div className="Down-Line-Side"/>}
            {depth > 0 &&  <div className="Down-Line-Up"/>}
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
    const [userData, setUserData, updateUserData] = store.useState("firebase-user-data")

    const [selectedPath, setSelectedPath] = listPageStore.useState("selected-path")

    return <div className="ListPage">
        <SourceTab source={"Firebase"}/>
        <div className="List-Page-List-Table">
            {Object.keys(safePath(userData, "lists")).map((listName) => {
                return <ListTab listName={listName} list={userData.lists[listName]} key={listName} 
                path={listName} setUserData={setUserData} userData={userData}/>
            })}
        </div>
    </div>
}

export default ListPage