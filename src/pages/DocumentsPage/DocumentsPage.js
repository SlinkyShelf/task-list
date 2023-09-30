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

import DocTab from "../../components/DocTab/DocTab";

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
    const [dirDir, setDirDir] = useState({})

    const { readPath, dataUpdates } = useGlobalData()

    function updateDirPath(newPath)
    {
        setDirPath(newPath)
        const pathToRead = `${framePath}/documents/${convertToDocPath(newPath)}`
        console.log(newPath, pathToRead)
        let {target} = readPath(pathToRead)
        setDir(target)
        setDirDir(newPath == ""?frameData.documents:target.dir)
    }

    useEffect(() => {
        let {target} = readPath(framePath)
        setFrameData(target)
        updateDirPath(dirPath)
    }, [...dataUpdates])

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

    return <div className="AllLists page">
        <ActionMenu state={actionMenu} setState={setActionMenu} options={menuOptions}/>
        <div className="Title-Tab">
            Documents
            <div className="page-back icon-back" onClick={close}/>
        </div>
        <div className="DocumentPage-Path">
            {/* Temp */}
            <span>{frameData.title || ""}</span>
            {`/${dirPath}`}
        </div>
        <div className="AllLists-List-Table mr-h">
            {Object.keys(dirDir).map((docName) => {
                const docData = dirDir[docName]
                function openDoc()
                {
                    if (docData.type == "folder")
                    {
                        updateDirPath(polishPath(`${dirPath}/${docName}`))
                    }
                }

                return <DocTab docName={docName} docData={docData} key={docName} 
                    open={openDoc}/>
            })}
        </div>
    </div>
}

export default DocumentsPage