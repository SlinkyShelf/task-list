import "./FramesPage.scss"
import store from "../../modules/store"
import useGlobalData from "../../hooks/useGlobalData"
import { useEffect, useState } from "react"

import AddButton from "../../components/AddButton/AddButton"
import PopupMenu from "../../components/PopupMenu/PopupMenu"

function Frame({path})
{
    const [frameData, setFrameData] = useState({})

    useEffect(() => {

    }, [path])

    return <div className="FramesPage-Frame">

    </div>
}

function FramesPage()
{
    const {dataUpdates, readPath, localUserData, firebaseUserData} = useGlobalData()
    const [frames, setFrames] = useState([""])

    const [popupOpen, setPopupOpen] = useState(false)

    useEffect(() => {
        const newFrames = ["d", "a", "b", "c"]
        Object.keys(localUserData.frames).map((frame, id) => {
            newFrames.push("local:frames/"+id)
        })

        Object.keys(firebaseUserData.frames).map((frame, id) => {
            newFrames.push("firebase:frames/"+id)
        })

        console.log(localUserData, firebaseUserData)

        setFrames(newFrames)
    }, [...dataUpdates])

    return <div className="FramesPage">
        <div className="Title-Tab">Frames</div>
        <div className="FramePage-Frame-Grid">
            {frames.map((path) => {
                return <Frame path={path} key={path}/>
            })}
        </div>
        <AddButton onClick={() => {setPopupOpen(true); console.log("Pressed")}}/>
        <PopupMenu open={popupOpen} setOpen={setPopupOpen} title="New Frame">

        </PopupMenu>
    </div>
}

export default FramesPage