import "./FramesPage.scss"
import store from "../../modules/store"
import useGlobalData from "../../hooks/useGlobalData"
import { useEffect, useState } from "react"

import AddButton from "../../components/AddButton/AddButton"
import PopupMenu from "../../components/PopupMenu/PopupMenu"

import { defaultFrameData, objClone } from "../../modules/default-data"
import { createId } from "../../modules/helpers"

import TripleDot from "../../components/TripleDot/TripleDot"

function Frame({path})
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
        <TripleDot/>
    </div>
}

function FramesPage()
{
    const {dataUpdates, readPath, localUserData, firebaseUserData} = useGlobalData()
    const [frames, setFrames] = useState([])

    const [newFrameTitle, setNewFrameTitle] = useState("Untitled")
    const [editTitle, setEditTitle] = useState(false)
    const [newFrameType, setNewFrameType] = useState("local")

    const [popupOpen, setPopupOpen] = useState(false)

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

    function CreateFrame()
    {
        const newFrame = objClone(defaultFrameData)
        newFrame.type = newFrameType
        newFrame.title = newFrameTitle

        let path
        switch (newFrameType) {
            case "local":
                path = "local:frames"
                break;
            case "firebase":
                path = "firebase:frames"
                break
            default:
                console.error(newFrameType+" is not a valid frame type");
                break;
        }

        const {data, setData, target} = readPath(path)

        let id = createId(target)
        target[id] = newFrame
        setData(data)

        // Setting defaults
        setEditTitle(false)
        setNewFrameTitle("Untitled")
        setNewFrameType("local")
        setPopupOpen(false)
    }

    return <div className="FramesPage">
        <div className="Title-Tab">Frames</div>
        <div className="FramePage-Frame-Grid">
            {frames.map((path) => {
                return <Frame path={path} key={path}/>
            })}
            <div className="FramesPage-Frame" style={{filter: "opacity(0%)"}}></div>
        </div>
        <AddButton onClick={() => {setPopupOpen(true); console.log("Pressed")}}/>
        <PopupMenu open={popupOpen} setOpen={setPopupOpen} title="New Frame">
            <div className="Section">
                <div className="Section-Header">Title</div>
                {editTitle?
                <div className="Section-Line">
                    <input className="Section-TextInput" value={newFrameTitle} 
                        onChange={(e) => setNewFrameTitle(e.target.value)}/>
                    <div className="Section-Button-1" 
                        onClick={() => setEditTitle(false)}>Apply</div>
                </div>:<div className="Section-Line">
                    <div className="Section-Info-1">{newFrameTitle}</div>
                    <div className="Section-Button-1" 
                        onClick={() => setEditTitle(true)}>Edit</div>
                </div>}
                
            </div>

            <div className="Section">
            <div className="Section-Header">Type</div>
                    <div className="Section-Line">
                        <div className="Section-Info-1">Type:</div>
                        <select className="Section-DropDown" value={newFrameType} 
                            onChange={(e) => setNewFrameType(e.target.value)}>
                            <option value={"local"}>Local</option>
                            <option value={"firebase"}>Cloud</option>
                        </select>
                    </div>
            </div>

            <div className="Section-Button-1" 
                onClick={CreateFrame}>Create</div>
        </PopupMenu>
    </div>
}

export default FramesPage