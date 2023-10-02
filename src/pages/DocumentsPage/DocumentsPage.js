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

function DocumentsPage({framePath, close})
{
    const [frameData, setFrameData] = useState(objClone(defaultFrameData))

    const [openDoc, setOpenDoc] = useState()

    const [popTitle, setPopTitle] = useState()
    const [newType, setNewType] = useState() 

    const { readPath, dataUpdates } = useGlobalData()

    useEffect(() => {
        let {target} = readPath(framePath)
        setFrameData(target)
    }, [...dataUpdates])

    const addMenu = [
        {"onClick": () => setNewType("folder"), "iconClass": "icon-folder"}
    ]

    let NewTypeDoc = newType && DocumentTypes[newType].Create

    function createNewDoc(newDoc)
    {
        const {target: frameData, setData, data} = readPath(framePath)
        const newId = createId(frameData.documents)
        frameData.documents[newId] = newDoc

        setData(data)
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
                    open={openDoc}/>
            })}
        </div>
        
        <AddButton menu={addMenu}/>
        <PopupMenu open={newType} setOpen={() => setNewType(null)} title={popTitle}>
            {newType && <NewTypeDoc create={createNewDoc} close={() => setNewType(null)} setTitle={setPopTitle}/>}
        </PopupMenu>
        {openDoc && <DocumentPage documentPath={framePath+"/documents/"+openDoc} close={() => setOpenDoc(null)}/>}
    </div>
}

export default DocumentsPage