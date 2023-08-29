import store from "../../modules/store"
import { createStore, useState } from "state-pool"
import ActionMenu from "../../components/ActionMenu/ActionMenu"
import useLongPress from "../../modules/long-press"
import { readPath, getListName, getTouchPos, createId } from "../../modules/helpers"

import "./TagsPage.scss"
import { useEffect, useRef } from "react"

const pagestore = createStore()
pagestore.setState("action-menu", {
    "tag": "",
    "pos": {"x": 0, "y": 0},
    "type": "header",
    "open": false
})
pagestore.setState("renaming", "")
pagestore.setState("color-editing", "")

function updateData(path, callBack)
{
    const [firebaseUserData, setFirebaseUserData] = store.useState("firebase-user-data")
    const drives = {
        "Firebase": {
            "data": firebaseUserData,
            "setData": setFirebaseUserData
        }
    }

    let {data, setData, target} = readPath(path, drives)
    callBack(data, target)
    setData(data)
}

function TagTab({tag, tagId, path})
{
    const [ newName, setNewName ] = useState("")
    const [actionMenu, setActionMenu] = pagestore.useState("action-menu")
    const [renaming, setRenaming] = pagestore.useState("renaming")
    const [colorEditing, setColorEditing] = pagestore.useState("color-editing")
    const [firebaseUserData, setFirebaseUserData] = store.useState("firebase-user-data")

    const colorRef = useRef(null)

    const [newColor, setNewColor ] = useState("#FF69B4")

    useEffect(() => {
        setNewName(tag.name)
        setNewColor(tag.color)
    }, [tag, tagId])

    useEffect(() => {
        if (colorRef.current)
        {
            colorRef.current.on = () => {

            }
        }
    }, [colorRef])

    const drives = {
        "Firebase": {
            "data": firebaseUserData,
            "setData": setFirebaseUserData
        }
    }

    function changeName()
    {
        let {data, setData, target: _tag} = readPath(path, drives)
        _tag.name = newName;
        setData(data)

        setRenaming("")
    }

    const longPressEvent = useLongPress(
        (e) => {
            const menu = {...actionMenu}
            menu.type = "tag"
            menu.open = true
            menu.pos = getTouchPos(e)
            menu.tag = tagId
            setActionMenu(menu)
        },  
        () => {}, {shouldPreventDefault: false});

    function isRenaming()
    {
        return renaming == getListName(path)
    }

    function isChangingColor()
    {
        return colorEditing == getListName(path)
    }

    function changeColor()
    {
        let {data, setData, target: _tag} = readPath(path, drives)
        _tag.color = newColor;
        setData(data)
    }

    return <div className="TagsPage-Tag" {...(!(isRenaming() || isChangingColor()) && longPressEvent)}>
        <input type="color" className="TagsPage-Tag-Color mr-h" value={newColor} 
            onChange={(e) => setNewColor(e.target.value)} ref={colorRef} onBlur={changeColor}/>
        {!isRenaming() && <div className="TagsPage-Tag-Name">{tag.name}</div>}
        {isRenaming() && <div className="ListPage-task-Rename">
                <input type="text" className="ListPage-task-Rename-Input" 
                value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Tag Name"/>
                <div className="icon-check" onClick={changeName}/>
            </div>}
        {/* {isChangingColor() && <InstantColorInput/>} */}
    </div>
}

function TagsPage()
{
    const [actionMenu, setActionMenu] = pagestore.useState("action-menu")
    const [firebaseUserData, setFirebaseUserData] = store.useState("firebase-user-data")
    const [currentPage, setCurrentPage] = store.useState("current-page")
    const [renaming, setRenaming] = pagestore.useState("renaming")
    const [colorEditing, setColorEditing] = pagestore.useState("color-editing")

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

    const drives = {
        "Firebase": {
            "data": firebaseUserData,
            "setData": setFirebaseUserData
        }
    }

    function newTag()
    {
        const newId = createId(firebaseUserData.tags)
        const newTag = {
            "name": "New Tag",
            "color": "#ff0000"
        }

        let {data, setData, target: _tags} = readPath("Firebase.tags", drives) 
        _tags[newId] = newTag
        setRenaming(newId)
        setData(data)
    }

    const menuOptions = {
        "header": {
            "New Tag": newTag
        },
        "tag": {
            "rename": () => setRenaming(actionMenu.tag),
            // "Change Color": () => setColorEditing(actionMenu.tag)
        }
    }

    return <div className="TagsPage">
        <ActionMenu pos={actionMenu.pos} 
            open={actionMenu.open} setOpen={openActionMenu} Options={menuOptions[actionMenu.type]}/>
        <div className="Title-Tab">
            <span {...longPressEvent}>Tags</span>
            <div className="icon-back left style-tint" onClick={() => setCurrentPage("all-lists")}/>
            {/* <div className="icon-edit right style-tint" onClick={() => {
                setEditPath(listPath)
                setCurrentPage("list-edit")
                }}/> */}
        </div>
        <div className="TagsPage-Tag-List">
            {Object.keys(firebaseUserData.tags).map((key) => {
                return <TagTab tag={firebaseUserData.tags[key]} 
                    path={"Firebase.tags."+key} tagId={key} key={key}/>
            })}
        </div>
    </div>
}

export default TagsPage