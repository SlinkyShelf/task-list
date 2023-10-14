import { useEffect, useState } from "react"
import { convertToLightPath, getDrive, getFrameName } from "../modules/path-functions"
import { getLastId, popId } from "../modules/path-functions"
import DocTab from "../components/DocTab/DocTab"
import { TitleEditSection } from "../components/SectionPresets/SectionPresets"
import { objClone } from "../modules/default-data"
import useGlobalData from "../hooks/useGlobalData"
import useDocHelpers from "../hooks/useDocHelpers"
import AddButton from "../components/AddButton/AddButton"
import getAddTypesMenu from "../modules/AddDocMenu"
import DocumentTypes from "../modules/document-types"
import CreateDoc from "../components/CreateDoc/CreateDoc"
import EditDoc from "../components/EditDoc/EditDoc"
import DocumentPage from "../pages/DocumentPage/DocumentPage"
import Path from "../components/DocPath/DocPath"
import usePages from "../hooks/usePages"

const icon = "icon-folder"

function Doc({docData, docPath, frameData})
{
    const [newType, setNewType] = useState() 
    const [editPath, setEditPath] = useState()

    const {addPage, goBack} = usePages()

    const addMenu = getAddTypesMenu(setNewType)

    function openDoc(dn)
    {
        addPage("document", {
            "documentPath": docPath+"/dir/"+dn
        })
    }

    return <div className="FolderDoc page">
        <div className="Title-Tab">
            {docData.title || "Error: No Title"}
            <div className="page-back icon-back" onClick={goBack}/>
        </div>
        <Path path={docPath} frameData={frameData}/>
        <div className="AllLists-List-Table mr-h">
            {Object.keys(docData.dir).map((dn) => {
                const dd = docData.dir[dn]

                return <DocTab 
                    docName={dn} 
                    docData={dd} 
                    key={dn} 
                    open={() => openDoc(dn)} 
                    edit={(p) => setEditPath(docPath+"/dir/"+dn)}
                    />
            })}
            <div/>
        </div>
        {/* <div></div> */}

        <AddButton menu={addMenu}/>
        <CreateDoc frameData={frameData} dirPath={docPath+"/dir"} docType={newType} setDocType={setNewType}/>
        <EditDoc frameData={frameData} docPath={editPath} setDocPath={setEditPath}/>

        {/* {openDoc && <DocumentPage documentPath={docPath+"/dir/"+openDoc} close={() => setOpenDoc(null)}/>} */}
    </div>
}

function Create({create, setTitle})
{
    const [docTitle, setDocTitle] = useState("New Folder")

    function make()
    {
        const newFolder = {
            "title": docTitle,
            "type": "folder",
            "dir": {

            }
        }

        create(newFolder)
    }

    useEffect(() => {
        setTitle("Create Folder")
    }, [])
    
    return <>
        <TitleEditSection title={docTitle} setTitle={setDocTitle}/>
        <div className="Section-Button-1" onClick={make}>Create</div>
    </>
}

function Edit({doc, setDoc, setTitle, docPath, close})
{
    const [docTitle, setDocTitle] = useState("Loading...")

    const {readPath} = useGlobalData()

    const {deletePath} = useDocHelpers()

    useEffect(() => {
        setTitle("Edit: "+doc.title)
        setDocTitle(doc.title)
    }, [doc])

    function applyEdits()
    {
        const newDoc = objClone(doc)
        newDoc.title = docTitle
        setDoc(newDoc)
    }
    
    function deleteFrame()
    {
        if (window.confirm(`Delete Folder \"${doc.title}\"?`))
        {
            deletePath(docPath)
            close()
        }
    }



    return <>
        <TitleEditSection title={docTitle} setTitle={setDocTitle}/>
        <div className="Section-Button-1" onClick={applyEdits}>Apply Edits</div>
        <div className="Section-Button-1 red" onClick={deleteFrame}>Delete</div>
    </>
}

const Folder = {
    "icon": icon,
    "Doc": Doc,
    "Create": Create,
    "Edit": Edit
}

DocumentTypes["folder"] = Folder

console.log("Added to types", DocumentTypes)

export default Folder