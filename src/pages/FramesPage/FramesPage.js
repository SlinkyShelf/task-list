import "./FramesPage.scss"
import store from "../../modules/store"
import useGlobalData from "../../hooks/useGlobalData"
import { useEffect, useState } from "react"

import AddButton from "../../components/AddButton/AddButton"
import PopupMenu from "../../components/PopupMenu/PopupMenu"

import { defaultFrameData, objClone } from "../../modules/default-data"
import { createId } from "../../modules/helpers"

import TripleDot from "../../components/TripleDot/TripleDot"

function Frame({path, edit})
{
    const [frameData, setFrameData] = useState({})

    const { readPath } = useGlobalData()

    useEffect(() => {
        const {data, setData, target} = readPath(path)
        setFrameData(target)
    }, [path])

    return <div className="FramesPage-Frame">
        <div className="FramesPage-Frame-Title">{frameData.title}</div>
        <div className="FramesPage-Frame-Type icon-folder"/>
        <TripleDot onClick={() => edit(path)}/>
    </div>
}

function TitleEditSection({title, setTitle})
{
    const [editTitle, setEditTitle] = useState(false)

    return <div className="Section">
        <div className="Section-Header">Title</div>
        {editTitle?
        <div className="Section-Line">
            <input className="Section-TextInput" value={title} 
                onChange={(e) => setTitle(e.target.value)}/>
            <div className="Section-Button-1" 
                onClick={() => setEditTitle(false)}>Apply</div>
        </div>:<div className="Section-Line">
            <div className="Section-Info-1">{title}</div>
            <div className="Section-Button-1" 
                onClick={() => setEditTitle(true)}>Edit</div>
        </div>}
        
    </div>
}

function EditFramePopup({open, setOpen, path})
{
    const [frameData, setFrameData] = useState({})
    const [frameTitle, setFrameTitle] = useState("Untitled")
    
    const {readPath} = useGlobalData()


    return (path && <PopupMenu open={open} setOpen={setOpen} title="Edit Frame">
        <TitleEditSection title={frameTitle} setTitle={setFrameTitle}/>
    </PopupMenu>)
}

function CreateFramePopup({open, setOpen})
{
    const [frameTitle, setFrameTitle] = useState("Untitled")
    const [frameType, setFrameType] = useState("local")

    const {readPath} = useGlobalData()

    function CreateFrame()
    {
        const newFrame = objClone(defaultFrameData)
        newFrame.type = frameType
        newFrame.title = frameTitle

        let path
        switch (frameType) {
            case "local":
                path = "local:frames"
                break;
            case "firebase":
                path = "firebase:frames"
                break
            default:
                console.error(frameType+" is not a valid frame type");
                break;
        }

        const {data, setData, target} = readPath(path)

        let id = createId(target)
        target[id] = newFrame
        setData(data)

        // Setting defaults
        setFrameTitle("Untitled")
        setFrameType("local")
        setOpen(false)
    }

    return <PopupMenu open={open} setOpen={setOpen} title="New Frame">
        <TitleEditSection title={frameTitle} setTitle={setFrameTitle}/>

        <div className="Section">
            <div className="Section-Header">Type</div>
                <div className="Section-Line">
                    <div className="Section-Info-1">Type:</div>
                    <select className="Section-DropDown" value={frameType} 
                        onChange={(e) => setFrameType(e.target.value)}>
                        <option value={"local"}>Local</option>
                        <option value={"firebase"}>Cloud</option>
                    </select>
                </div>
            </div>

        <div className="Section-Button-1" 
            onClick={CreateFrame}>Create</div>
    </PopupMenu>
}

function FramesPage()
{
    const {dataUpdates, readPath, localUserData, firebaseUserData} = useGlobalData()
    const [frames, setFrames] = useState([])

    const [popupOpen, setPopupOpen] = useState(false)

    const [editing, setEditing] = useState()
    const [editPopupOpen, setEditPopupOpen] = useState(false)

    useEffect(() => {
        const newFrames = []
        Object.keys(localUserData.frames).map((id) => {
            newFrames.push("local:frames/"+id)
        })

        Object.keys(firebaseUserData.frames).map((id) => {
            newFrames.push("firebase:frames/"+id)
        })

        console.log(localUserData, firebaseUserData)

        setFrames(newFrames)
    }, [...dataUpdates])

    function edit(path)
    {
        setEditPopupOpen(true)
        setEditing(path)
    }

    return <div className="FramesPage">
        <div className="Title-Tab">Frames</div>
        <div className="FramePage-Frame-Grid">
            {frames.map((path) => {
                return <Frame path={path} key={path} edit={edit}/>
            })}
            <div className="FramesPage-Frame" style={{filter: "opacity(0%)"}}></div>
        </div>
        <AddButton onClick={() => {setPopupOpen(true); console.log("Pressed")}}/>
        <CreateFramePopup open={popupOpen} setOpen={setPopupOpen}/>
        <EditFramePopup open={editPopupOpen} setOpen={setEditPopupOpen} path={editing}/>
    </div>
}

export default FramesPage