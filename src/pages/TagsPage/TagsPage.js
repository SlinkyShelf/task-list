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
import usePages from "../../hooks/usePages"
import AddButton from "../../components/AddButton/AddButton"
import Path from "../../components/DocPath/DocPath"
import { TitleEditSection } from "../../components/SectionPresets/SectionPresets"
import { defaultTag } from "../../modules/default-data"

function TagTab({tag, tagId, edit})
{
    const [ newName, setNewName ] = useState("")

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

    // onBlur={changeColor}

    return <div className="TagsPage-Tag">
        <input type="color" className="TagsPage-Tag-Color mr-h" value={newColor} 
            onChange={(e) => setNewColor(e.target.value)} ref={colorRef} disabled/>
        <div className="TagsPage-Tag-Name">{tag.name}</div>
        <TripleDot extraClasses="cr mr-r" onClick={edit}/>
    </div>
}

function TagsPage({framePath})
{
    const [frameData, setFrameData] = useState({})
    const [frameTags, setFrameTags] = useState({})
    const {readPath, dataUpdates} = useGlobalData()
    const {goBack} = usePages()

    const [newTagOpen, setNewTagOpen] = useState(false)
    const [tagEditPath, setTagEditPath] = useState()

    const addMenu = [
        {"onClick": () => setNewTagOpen(true)}
    ]

    useEffect(() => {
        const {target: frameData} = readPath(framePath) 
        setFrameData(frameData)
        setFrameTags(frameData.tags)
    }, [framePath, ...dataUpdates])

    return <div className="TagsPage page">
        <div className="Title-Tab">
            <span>Tags</span>
            <div className="icon-back left" onClick={goBack}/>
        </div>
        <Path frameData={frameData} path={framePath}/>
        <div className="TagsPage-Tag-List">
            {Object.keys(frameTags).map((key) => {
                const path = framePath+"/tags/"+key
                function edit()
                {
                    setTagEditPath(path)
                }

                return <TagTab tag={frameTags[key]}  edit={edit}
                    path={path} tagId={key} key={key}/>
            })}
        </div>

        <AddButton menu={addMenu}/>

        <CreateTag open={newTagOpen} setOpen={setNewTagOpen} framePath={framePath}/>
        <EditTag tagPath={tagEditPath} setTagPath={setTagEditPath}/>
    </div>
}

const defaultColor = "#FF69B4"

function ColorEditSection({color, setColor, title})
{
    const [newColor, setNewColor] = useState(defaultColor)
    const [editing, setEditing] = useState(false)

    const colorRef = useRef(null)

    return <div className="Section">
        <div className="Section-Header">{title || "Color"}</div>
        <div className="Section-Line">
            <input type="color" className="TagsPage-Tag-Color mr-h" value={newColor} 
                onChange={(e) => setNewColor(e.target.value)} ref={colorRef} disabled={!editing}/>
                
            <div className="Section-Button-1" 
                onClick={() => {setEditing(false); setColor(tempTitle)}}>Apply</div>
        </div>
    </div>
}

function CreateTag({open, setOpen, framePath})
{
    const [tagTitle, setTagTitle] = useState("New Tag")
    const [tagColor, setTagColor] = useState(defaultColor)
    const {readPath} = useGlobalData()

    function Create()
    {
        const {target: frameData, data, setData} = readPath(framePath)

        const newId = createId(frameData.tags)
        const newTag = {
            "name": tagTitle,
            "color": tagColor
        }

        frameData.tags[newId] = newTag
        setData(data)

        setOpen(false)
    }

    return <PopupMenu open={open} setOpen={setOpen}>
        <TitleEditSection title={tagTitle} setTitle={setTagTitle} />
        <div className="Section-Button-1" onClick={Create}>Create</div>
        <div className="Section-Button-1" onClick={() => setOpen(false)}>Cancel</div>
    </PopupMenu>
}

function EditTag({tagPath, setTagPath})
{
    const [tagData, setTagData] = useState(defaultTag)
    const [tagTitle, setTagTitle] = useState("New Tag")
    const [tagColor, setTagColor] = useState(defaultColor) 
    const {readPath, dataUpdates} = useGlobalData()

    function Apply()
    {
        const {target, data, setData} = readPath(tagPath)
        target.title = tagTitle
        setData(data)
        setTagPath(null)
    }

    useEffect(() => {
        if (!tagPath) {return;}

        const {target} = readPath(tagPath)
        setTagData(target)
    }, [...dataUpdates, tagPath])

    return <PopupMenu open={tagPath} setOpen={(c) => {setTagPath(c?tagPath:null)}}>
        <TitleEditSection title={tagTitle} setTitle={setTagTitle} />
        <div className="Section-Button-1" onClick={Apply}>Apply</div>
        <div className="Section-Button-1" onClick={() => setTagPath(null)}>Cancel</div>
    </PopupMenu>
}

export default TagsPage