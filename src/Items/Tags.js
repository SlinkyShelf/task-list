import { useState, useEffect } from "react"
import PopupMenu from "../components/PopupMenu/PopupMenu"
import { TitleEditSection, ColorEditSection } from "../components/SectionPresets/SectionPresets"
import useGlobalData from "../hooks/useGlobalData"
import usePages from "../hooks/usePages"
import TripleDot from "../components/TripleDot/TripleDot"
import { objClone } from "../modules/default-data"
import { defaultTag } from "../modules/default-data"
import { createId } from "../modules/path-functions"

const defaultColor = "#aa0000"

function TagPicker({frameData, tags, setTags, framePath})
{
    const [selectedTag, setSelectedTag] = useState()
    const [tagEditOpen, setTagEditOpen] = useState()

    function AddTag()
    {
        if (!selectedTag) {return}

        const newTags = objClone(tags)
        newTags[selectedTag] = true
        setTags(newTags)
    }

    const {addPage, goBack} = usePages()

    function RemoveTag(key)
    {
        const newTags = objClone(tags)
        delete newTags[key]
        setTags(newTags)
    }

    useEffect(() => {
        if (frameData && frameData.tags && Object.keys(frameData.tags).length > 0)
            setSelectedTag(Object.keys(frameData.tags)[0])
    }, [frameData])

    return <div className="Section">
        <div className="Section-Header">Tags</div>
        <div>
            {Object.keys(tags).map((key) => {
                const tag = frameData.tags[key]
                return <div className="AllLists-List Tab" key={key}>
                    <input type="color" className="TagsPage-Tag-Color mr-r" value={tag.color} disabled/>
                    {tag.title}
                    <div className="icon-x cr" onClick={() => RemoveTag(key)}/>
                </div>
            })}
        </div>
        <div className="Section-Line">
            <select className="Section-DropDown" value={selectedTag} 
                onChange={(e) => setSelectedTag(e.target.value)}>
                {Object.keys(frameData.tags).map((key) => {
                    return <option key={key} value={key}>{frameData.tags[key].title}</option>
                })}
            </select>
            <div className="Section-Button-1" onClick={AddTag}>Add</div>
        </div>
        <div className="Section-Button-1" 
            onClick={() => addPage("tags", {"framePath": framePath})}>Edit Tags</div>
        
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
            "title": tagTitle,
            "color": tagColor
        }

        frameData.tags[newId] = newTag
        setData(data)

        setOpen(false)
    }

    return <PopupMenu open={open} setOpen={setOpen}>
        <TitleEditSection title={tagTitle} setTitle={setTagTitle} />
        <ColorEditSection color={tagColor} setColor={setTagColor}/>
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
        target.color = tagColor
        setData(data)
        setTagPath(null)
    }

    useEffect(() => {
        if (!tagPath) {return;}

        const {target} = readPath(tagPath)
        setTagData(target)
        setTagColor(target.color)
        setTagTitle(target.title)
    }, [...dataUpdates, tagPath])

    return <PopupMenu open={tagPath} setOpen={(c) => {setTagPath(c?tagPath:null)}}>
        <TitleEditSection title={tagTitle} setTitle={setTagTitle} />
        <ColorEditSection color={tagColor} setColor={setTagColor}/>
        <div className="Section-Button-1" onClick={Apply}>Apply</div>
        <div className="Section-Button-1" onClick={() => setTagPath(null)}>Cancel</div>
    </PopupMenu>
}

function TagTab({tag, tagId, edit})
{
    return <div className="TagsPage-Tag">
        <input type="color" className="TagsPage-Tag-Color mr-h" value={tag.color} disabled/>
        <div className="TagsPage-Tag-Name">{tag.title}</div>
        <TripleDot extraClasses="cr mr-r" onClick={edit}/>
    </div>
}

export { TagPicker, CreateTag, EditTag, TagTab }