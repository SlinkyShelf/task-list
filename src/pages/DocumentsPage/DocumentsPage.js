import "./DocumentsPage.scss"
import store from "../../modules/store"
import { useEffect, useState, useRef } from "react"

import useGlobalData from "../../hooks/useGlobalData";
import { defaultFrameData, objClone } from "../../modules/default-data";

import DocTab from "../../components/DocTab/DocTab";
import DocumentPage from "../DocumentPage/DocumentPage";

import AddButton from "../../components/AddButton/AddButton";

import CreateDoc from "../../components/CreateDoc/CreateDoc";
import EditDoc from "../../components/EditDoc/EditDoc";
import getAddTypesMenu from "../../modules/AddDocMenu";
import usePages from "../../hooks/usePages";

function DocumentsPage({framePath})
{
    const [frameData, setFrameData] = useState(objClone(defaultFrameData))

    const [openDoc, setOpenDoc] = useState()

    const {addPage, goBack} = usePages()

    const [newType, setNewType] = useState() 
    const [editPath, setEditPath] = useState()

    const { readPath, dataUpdates } = useGlobalData()

    useEffect(() => {
        let {target} = readPath(framePath)
        setFrameData(target)
    }, [...dataUpdates])

    const addMenu = getAddTypesMenu(setNewType)

    return <div className="AllLists page">
        <div className="Title-Tab">
            Documents
            <div className="page-back icon-back" onClick={goBack}/>
        </div>
        <div className="DocumentPage-Path">
            {/* Temp */}
            <span>{frameData.title || ""}</span>
            <span className="slash">/</span>
        </div>
        <div className="AllLists-List-Table mr-h">
            {Object.keys(frameData.documents).map((docName) => {
                const docData = frameData.documents[docName]
                function openDoc()
                {
                    addPage("document", {
                        "documentPath": framePath+"/documents/"+docName
                    })
                }

                return <DocTab docName={docName} docData={docData} key={docName} 
                    open={openDoc} edit={() => setEditPath(framePath+"/documents/"+docName)}/>
            })}
        </div>

        <AddButton menu={addMenu}/>
        <CreateDoc frameData={frameData} dirPath={framePath+"/documents"} docType={newType} setDocType={setNewType}/>
        <EditDoc frameData={frameData} docPath={editPath} setDocPath={setEditPath}/>
    </div>
}

export default DocumentsPage