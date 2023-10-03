import { useEffect, useState } from "react"
import { convertToLightPath, getDrive, getFrameName } from "../modules/path-functions"
import { getLastId, popId } from "../modules/path-functions"
import DocTab from "../components/DocTab/DocTab"
import { TitleEditSection } from "../components/SectionPresets/SectionPresets"
import { objClone } from "../modules/default-data"
import useGlobalData from "../hooks/useGlobalData"
import useDocHelpers from "../hooks/useDocHelpers"

const folderIcon = "icon-folder"

function Path({path, frameData})
{
    function generatePathDisplay()
    {
        const display = []
        const lightPath = convertToLightPath(path)
        let frameSet = frameData.documents

        lightPath.map((p) => {
            display.push("/")
            display.push(frameSet[p].title)
            frameSet = frameSet[p].dir
        })

        return display
    }

    return <div className="DocumentPage-Path">
        {/* Temp */}
        <span>{frameData.title}</span>
        {generatePathDisplay().map((dis, i) => {
            return (dis == "/"?<span key={i}>/</span>:
            <span key={i}>{dis}</span>)
        })}
    </div>
}

function FolderDoc({docData, docName, docPath, close, frameData})
{
    const [openDir, setOpenDir] = useState()

    return <div className="FolderDoc page">
        <div className="Title-Tab">
            {docData.title || "Error: No Title"}
            <div className="page-back icon-back" onClick={close}/>
        </div>
        <Path path={docPath} frameData={frameData}/>
        <div className="AllLists-List-Table mr-h">
            {Object.keys(docData.dir).map((docName) => {
                const docData = docData.dir[docName]
                function d()
                {
                    console.log("Click")
                    if (docData.type == "folder")
                    {
                        setOpenDir(docName)
                    }
                }

                return <DocTab docName={docName} docData={docData} key={docName} 
                    open={d}/>
            })}
        </div>
        {openDir && <FolderDoc
            docName={openDir}
            documentPath={docPath+"/dir/"+openDir}
            docData={docData.dir[openDir]}
            close={() => setOpenDir(null)}/>}
    </div>
}

function FolderCreate({create, setTitle})
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

function FolderEdit({doc, setDoc, setTitle, docPath, close})
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

export { FolderDoc, folderIcon, FolderCreate, FolderEdit }