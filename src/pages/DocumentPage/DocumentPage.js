import { useEffect, useState } from "react"
import useGlobalData from "../../hooks/useGlobalData"

import "./DocumentPage.scss"

import DocumentTypes from "../../modules/document-types"
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
        "framePath": getFramePath(documentPath)
        // "driveData": data
    }

    const ready = docData && docData.type

    const Doc = ready && DocumentTypes[docData.type].Doc

    return <div className="page">
        {ready && <Doc {...pageData}/>}
    </div>
}

export default DocumentPage