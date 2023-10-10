import { useEffect, useState } from "react"
import useGlobalData from "../../hooks/useGlobalData"

import "./DocumentPage.scss"

import Folder from "../../DocumentTypes/Folder"
import { getFramePath, getLastId } from "../../modules/path-functions"

function DocumentPage({documentPath, close})
{
    const {readPath, dataUpdates} = useGlobalData()
    const [docData, setDocData] = useState({})
    const [frameData, setFrameData] = useState({})

    useEffect(() => {
        const {target: doc} = readPath(documentPath)
        setDocData(doc)

        const {target: frame} = readPath(getFramePath(documentPath))
        setFrameData(frame)

    }, [documentPath, ...dataUpdates])

    const pageData = {
        "docData":docData, 
        "docPath": documentPath,

        "frameData": frameData,

        "close": close,
        // "driveData": data
    }

    return <div className="page">
        {docData.type == "folder" && <Folder.Doc {...pageData}/>}
    </div>
}

export default DocumentPage