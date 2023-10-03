import "./DocumentsPage.scss"
import store from "../../modules/store"
import { useEffect, useState, useRef } from "react"

import useGlobalData from "../../hooks/useGlobalData";
import { defaultFrameData, objClone } from "../../modules/default-data";

import DocTab from "../../components/DocTab/DocTab";
import DocumentPage from "../DocumentPage/DocumentPage";

import DocumentTypes from "../../modules/document-types";
import { createId } from "../../modules/helpers";
import AddButton from "../../components/AddButton/AddButton";
import PopupMenu from "../../components/PopupMenu/PopupMenu";
import { getLastId, popId } from "../../modules/path-functions";

function DocumentsPage({framePath, close})
{
    const [frameData, setFrameData] = useState(objClone(defaultFrameData))

    const [openDoc, setOpenDoc] = useState()

    const [popUpOpen, setPopupOpen] = useState()
    const [popTitle, setPopTitle] = useState()
    const [newType, setNewType] = useState() 
    const [editPath, setEditPath] = useState()
    const [editDoc, setEditDoc] = useState({})

    const { readPath, dataUpdates } = useGlobalData()

    useEffect(() => {
        let {target} = readPath(framePath)
        setFrameData(target)
    }, [...dataUpdates])

    const addMenu = [
        {"onClick": () => setNewType("folder"), "iconClass": "icon-folder"}
    ]

    const NewTypeDoc = newType && DocumentTypes[newType].Create
    const EditDoc = editPath && editDoc.type && DocumentTypes[editDoc.type].Edit

    function createNewDoc(newDoc)
    {
        const {target: frameData, setData, data} = readPath(framePath)
        const newId = createId(frameData.documents)
        frameData.documents[newId] = newDoc

        setData(data)
        setNewType(null)
    }

    function editDocFunc(newDoc)
    {
        const {target, data, setData} = readPath(popId(editPath))
        const id = getLastId(editPath)
        target[id] = newDoc
        setData(data)

        closePopup()
    }
    
    useEffect(() => {
        if (!editPath) {return}

        const {target, data, setData} = readPath(editPath)
        console.log(target)
        setEditDoc(target)
    }, [editPath])

    function closePopup()
    {
        setEditPath(null)
        setEditDoc({})
        setPopTitle("")
        setNewType(null)
    }

    return <div className="AllLists page">
        <div className="Title-Tab">
            Documents
            <div className="page-back icon-back" onClick={close}/>
        </div>
        <div className="DocumentPage-Path">
            {/* Temp */}
            <span>{frameData.title || ""}/</span>
        </div>
        <div className="AllLists-List-Table mr-h">
            {Object.keys(frameData.documents).map((docName) => {
                const docData = frameData.documents[docName]
                function openDoc()
                {
                    setOpenDoc(docName)
                }

                return <DocTab docName={docName} docData={docData} key={docName} 
                    open={openDoc} edit={() => setEditPath(framePath+"/documents/"+docName)}/>
            })}
        </div>
        
        <AddButton menu={addMenu}/>
        <PopupMenu open={newType || editPath} setOpen={closePopup} title={popTitle}>
            {newType && <NewTypeDoc create={createNewDoc} close={closePopup} setTitle={setPopTitle}/>}
            {editPath && editDoc.type && <EditDoc 
                setDoc={editDocFunc} 
                doc={editDoc} 
                frameData={frameData}
                docPath={editPath}
                setTitle={setPopTitle}
                close={closePopup}/>}
        </PopupMenu>
        {openDoc && <DocumentPage documentPath={framePath+"/documents/"+openDoc} close={() => setOpenDoc(null)}/>}
    </div>
}

export default DocumentsPage