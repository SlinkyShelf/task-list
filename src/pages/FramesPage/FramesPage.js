import "./FramesPage.scss"
import store from "../../modules/store"
import useGlobalData from "../../hooks/useGlobalData"
import { useEffect, useState } from "react"

function Frame({path})
{
    return <div className="FramesPage-Frame">

    </div>
}

function FramesPage()
{
    const {dataUpdates, readPath, localUserData, firebaseUserData} = useGlobalData()
    const [frames, setFrames] = useState([""])

    console.log(localUserData, firebaseUserData)

    useEffect(() => {
        const newFrames = ["d", "", "", ""]
        Object.keys(localUserData.frames).map((frame, id) => {
            newFrames.push("local:frames/"+id)
        })

        Object.keys(firebaseUserData.frames).map((frame, id) => {
            newFrames.push("firebase:frames/"+id)
        })

        setFrames(newFrames)
    }, [...dataUpdates])

    return <div className="FramesPage">
        <div className="Title-Tab">Frames</div>
        <div className="FramePage-Frame-Grid">
            {frames.map((path) => {
                return <Frame path={path} key={path}/>
            })}
        </div>
    </div>
}

export default FramesPage