import { useState } from "react";
import DocumentTypes from "../../modules/document-types";
import PopupMenu from "../PopupMenu/PopupMenu";
import { createId } from "../../modules/path-functions";
import useGlobalData from "../../hooks/useGlobalData";

function CreateDoc({docType, setDocType, dirPath, frameData})
{
    const [popTitle, setPopTitle] = useState("")

    const { readPath } = useGlobalData()

    function close()
    {
        setDocType(null)
        setPopTitle("")
    }

    function createNewDoc(newDoc)
    {
        const {target: dir, setData, data} = readPath(dirPath)
        const newId = createId(dir)
        dir[newId] = newDoc

        setData(data)
        setDocType(null)
    }

    const NewTypeDoc = docType && DocumentTypes[docType].Create

    return <PopupMenu open={docType} setOpen={close} title={popTitle}>
        {docType!=null && <NewTypeDoc 
            create={createNewDoc} 
            close={close} 
            setTitle={setPopTitle} 
            frameData={frameData}/>}
    </PopupMenu>
}

export default CreateDoc