import store from "../../modules/store"
import { createStore, useState } from "state-pool"
import {ActionMenu} from "../../components/ActionMenu/ActionMenu"
import useLongPress from "../../modules/long-press"
import { getListName, getTouchPos, createId } from "../../modules/helpers"
import useGlobalData from "../../hooks/useGlobalData"
import PopupMenu from "../../components/PopupMenu/PopupMenu"

import TripleDot from "../../components/TripleDot/TripleDot"

import "./TagsPage.scss"
import { useEffect, useRef } from "react"

function TagTab({tag, tagId, path, edit})
{
    const [ newName, setNewName ] = useState("")
    const [actionMenu, setActionMenu] = pagestore.useState("action-menu")
    const [renaming, setRenaming] = pagestore.useState("renaming")
    const [colorEditing, setColorEditing] = pagestore.useState("color-editing")
    const [userData, setUserData] = store.useState("user-data")

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
        // let {data, setData, target: _tag} = readPath(path, drives)
        // _tag.color = newColor;
        // setData(data)
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

function TagsPage({framePath})
{
    const [frameTags, setFrameTags] = useState({})
    const {readPath, dataUpdates} = useGlobalData()

    function newTag()
    {
        const newId = createId(firebaseUserData.tags)
        const newTag = {
            "name": "New Tag",
            "color": "#ff0000"
        }

        let {data, setData, target: frame} = readPath(framePath+"/tags") 
        frame.tags[newId] = newTag
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