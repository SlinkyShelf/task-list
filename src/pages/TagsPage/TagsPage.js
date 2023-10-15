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
            onChange={(e) => setNewColor(e.target.value)} ref={colorRef} />
        <div className="TagsPage-Tag-Name">{tag.name}</div>
        <TripleDot extraClasses="cr" onClick={edit}/>
    </div>
}

function TagsPage({framePath})
{
    const [frameData, setFrameData] = useState({})
    const [frameTags, setFrameTags] = useState({})
    const {readPath, dataUpdates} = useGlobalData()
    const {goBack} = usePages()

    const [newTagOpen, setNewTagOpen] = useState(false)

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
                return <TagTab tag={frameTags[key]} 
                    path={framePath+"/tags/"+key} tagId={key} key={key}/>
            })}
        </div>

        <AddButton menu={addMenu}/>

        <CreateTag open={newTagOpen} setOpen={setNewTagOpen} framePath={framePath}/>
    </div>
}

const defaultColor = "#FF69B4"

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

function EditTag({tagPath})
{

}

export default TagsPage