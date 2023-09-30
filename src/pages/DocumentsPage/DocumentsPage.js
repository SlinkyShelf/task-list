import "./DocumentsPage.scss"
import store from "../../modules/store"
import { useEffect, useState, useRef } from "react"

import useLongPress from "../../modules/long-press";

import {createStore } from 'state-pool';
import { ConvertListsPath, getListName, getParentPath, safePath } from "../../modules/helpers";
import {ActionMenu, ActionMenuState} from "../../components/ActionMenu/ActionMenu";
import { getTouchPos } from "../../modules/helpers";
import useGlobalData from "../../hooks/useGlobalData";
import { defaultFrameData, objClone } from "../../modules/default-data";

const listPageStore = createStore();
listPageStore.setState("action-menu", ActionMenuState())

const colorDepth = ["red", "green", "blue", "orange"]

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

function ListTab({list, listName, depth, path, setDirPath})
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
            if (list.type == "folder")
            {
                console.log(path)
                setDirPath(path)

            }
            else if (list.type == "list")
            {
                // setListPath(path)
                // setCurrentPage("list")
            }
        });

    // const visibleStyle = {"display": open?"block":"none"}

    return <div className="AllLists-Tab-Container">
        {list.type == "folder" && <div className="AllLists-Folder AllLists-Tab">
            <div className="AllLists-Title Tab" {...longPressEvent}>
                <div className="mr-h icon-folder" />
                {listName}
                {/* {depth > 0 &&  <div className="Down-Line-Side"/>} */}
            </div>
            {/* <div className="AllLists-Folder-List" style={visibleStyle}>
                {Object.keys(list.lists).map((lName) => {
                    return <ListTab list={list.lists[lName]} listName={lName} 
                    key={lName} depth={depth+1} path={`${path}.${lName}`}/>
                })}
            </div> */}
            {/* <div className="Down-Line-Up" style={visibleStyle}/> */}
        </div>}

        {list.type == "task-list" && <div>
            <div className="AllLists-List Tab" {...longPressEvent}>
                {listName}
                {depth > 0 &&  <div className="Down-Line-Side"/>}
            </div>
        </div>}
    </div>
}

function convertToDocPath(path)
{
    return path.replace("/", "/dir/")
}

function polishPath(path)
{   
    if (path.indexOf("/") == 0)
        return path.substring(1)
}

function DocumentsPage({framePath, close})
{
    const [actionMenu, setActionMenu] = listPageStore.useState("action-menu")
    const [frameData, setFrameData] = useState(objClone(defaultFrameData))
    const [dirPath, setDirPath] = useState("")
    const [dir, setDir] = useState({})

    const { readPath, dataUpdates } = useGlobalData()

    useEffect(() => {
        let {target} = readPath(framePath)

        setFrameData(target)
    }, [...dataUpdates])

    useEffect(() => {
        const pathToRead = `${framePath}/documents/${convertToDocPath(dirPath)}`
        console.log(pathToRead)
        let {target} = readPath(pathToRead)
        setDir(target)
    }, [dirPath, frameData])

    function openActionMenu(toggle)
    {
        const menu = {...actionMenu}
        menu.open = toggle
        setActionMenu(menu)
    }

    function create(d)
    {
        console.log(ConvertListsPath(actionMenu.path), actionMenu.path)
        let {data, setData, target} = readPath(ConvertListsPath(actionMenu.path))

        const listName = FindName(target.lists, "Untitled")

        target.lists[listName] = d
        setData(data)
        // setEditPath(`${actionMenu.path}.${listName}`)
        // setCurrentPage("list-edit")
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
        const {data, setData, target} = readPath(actualPath)
        delete target.lists[getListName(actionMenu.path)]
        setData(data)
    }

    const defaultOptions = {
        "Cancel": () => openActionMenu(false)
    }

    const editOptions = {
        "Edit": () => {
            // setEditPath(actionMenu.path)
            // setCurrentPage("list-edit")
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

    const dirData = dirPath == ""?frameData.documents:dir.dir

    return <div className="AllLists page">
        <ActionMenu state={actionMenu} setState={setActionMenu} options={menuOptions}/>
        <div className="Title-Tab">
            Documents
            <div className="page-back icon-back" onClick={close}/>
        </div>
        <div className="DocumentPage-Path">
            {/* Temp */}
            <span>{frameData.title || ""}</span>
            {`${dirPath}/`}
        </div>
        <div className="AllLists-List-Table mr-h">
            {Object.keys(dirData).map((listName) => {
                return <ListTab listName={listName} list={dirData[listName]} key={listName} 
                path={polishPath(`${dirPath}/${listName}`)} setDirPath={setDirPath}/>
            })}
        </div>
    </div>
}

export default DocumentsPage