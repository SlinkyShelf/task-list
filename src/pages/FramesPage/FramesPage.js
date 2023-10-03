import "./FramesPage.scss"
import store from "../../modules/store"
import useGlobalData from "../../hooks/useGlobalData"
import { useEffect, useState } from "react"

import AddButton from "../../components/AddButton/AddButton"
import PopupMenu from "../../components/PopupMenu/PopupMenu"

import { defaultFrameData, objClone } from "../../modules/default-data"
import { createId } from "../../modules/helpers"

import TripleDot from "../../components/TripleDot/TripleDot"
import { getLastId, popId } from "../../modules/path-functions"
import DocumentsPage from "../DocumentsPage/DocumentsPage"

import { TitleEditSection } from "../../components/SectionPresets/SectionPresets"

function Frame({path, edit, setDocPagePath})
{
    const [frameData, setFrameData] = useState({})

    const { readPath, dataUpdates } = useGlobalData()

    useEffect(() => {
        const {data, setData, target} = readPath(path)
        setFrameData(target)
    }, [path, ...dataUpdates])

    return <div className="FramesPage-Frame" onClick={() => setDocPagePath(path)}>
        <div className="FramesPage-Frame-Title">{frameData.title}</div>
        <div className="FramesPage-Frame-Type icon-folder"/>
        <TripleDot onClick={() => edit(path)} extraClasses={"tr"}/>
    </div>
}

function EditFramePopup({open, setOpen, path})
{
    const [frameData, setFrameData] = useState(objClone(defaultFrameData))
    
    const {readPath, dataUpdates} = useGlobalData()

    function updateFrameTitle(newTitle)
    {
        const {data, setData, target} = readPath(path)
        target.title = newTitle
        setData(data)
    }

    useEffect(() => {
        if (!path) {return;}

        const {target} = readPath(path)

        setFrameData(target)
    }, [...dataUpdates, path])

    function deleteFrame()
    {
        if (window.confirm(`Delete Frame \"${frameData.title}\"?`))
        {
            const id = getLastId(path)
            const popedPath = popId(path)

            const {data, setData, target} = readPath(popedPath)
            delete target[id]
            setData(data)
            setOpen(false)
        }
    }


    return <PopupMenu open={open} setOpen={setOpen} title={"Edit Frame: "+frameData.title}>
        <TitleEditSection title={frameData.title} setTitle={updateFrameTitle}/>
        <div className="Section-Button-1 red" onClick={deleteFrame}>Delete</div>
    </PopupMenu>
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

    const [docsPagePath, setDocPagePath] = useState()

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

    const addMenu = [
        {"onClick": () => setPopupOpen(true)}
    ]

    return <div className="FramesPage page">
        {/* <div className="Title-Tab">Frames</div> */}
        <div className="FramePage-Grid-Container">
            <div className="FramePage-Frame-Grid">
                {frames.map((path) => {
                    return <Frame path={path} key={path} edit={edit} setDocPagePath={setDocPagePath}/>
                })}
                <div className="FramesPage-Frame" style={{filter: "opacity(0%)"}}></div>
            </div>
        </div>
        <AddButton menu={addMenu}/>
        <CreateFramePopup open={popupOpen} setOpen={setPopupOpen}/>
        <EditFramePopup open={editPopupOpen} setOpen={setEditPopupOpen} path={editing}/>

        {docsPagePath && <DocumentsPage framePath={docsPagePath} close={() => setDocPagePath(null)}/>}
    </div>
}

export default FramesPage