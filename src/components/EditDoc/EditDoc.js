import { useEffect, useState } from "react";
import DocumentTypes from "../../modules/document-types";
import PopupMenu from "../PopupMenu/PopupMenu";
import { createId } from "../../modules/path-functions";
import useGlobalData from "../../hooks/useGlobalData";
import { popId, getLastId } from "../../modules/path-functions";

function EditDoc({docPath, setDocPath, frameData})
{
    const [popTitle, setPopTitle] = useState("")
    const [docData, setDocData] = useState()
    const [docType, setDocType] = useState()

    const { readPath } = useGlobalData()

    useEffect(() => {
        if (docPath == null)
        {
            setDocData(null)
            return 
        }

        const {target} = readPath(docPath)
        setDocType(target.type)
        setDocData(target)
    }, [docPath])

    function close()
    {
        setDocPath(null)
        setDocData(null)
        setDocType(null)
        setPopTitle("")
    }

    function editDocFunc(newDoc)
    {
        const {target, data, setData} = readPath(popId(docPath))
        const id = getLastId(docPath)
        target[id] = newDoc
        setData(data)

        close()
    }

    const DocEdit = docType && DocumentTypes[docType] && DocumentTypes[docType].Edit

    return <PopupMenu open={docType} setOpen={close} title={popTitle}>
        {DocEdit!=null && <DocEdit 
        setDoc={editDocFunc} 
        doc={docData} 
        frameData={frameData}
        docPath={docPath}
        close={close} setTitle={setPopTitle} />}
    </PopupMenu>
}

export default EditDoc