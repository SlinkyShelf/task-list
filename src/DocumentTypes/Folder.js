import { useEffect, useState } from "react"
import { convertToLightPath, getDrive, getFrameName } from "../modules/path-functions"
import PopupMenu from "../components/PopupMenu/PopupMenu"
import DocTab from "../components/DocTab/DocTab"
import { TitleEditSection } from "../components/SectionPresets/SectionPresets"

const folderIcon = "icon-folder"

function Path({path, frameData})
{
    function generatePathDisplay()
    {
        const display = []
        const lightPath = convertToLightPath(path)
        let frameSet = frameData.documents

        lightPath.map((p) => {
            frameSet
            display.push(frameSet[p])
        })
    }

    return <div className="DocumentPage-Path">
        {/* Temp */}
        <span>{frameData.title}</span>
        {generatePathChildren().map((dis) => {
            return (dis == "/"?<span>/</span>:
            <span>dis</span>)
        })}
    </div>
}

function FolderDoc({docData, docName, docPath, close, frameData})
{
    const [openDir, setOpenDir] = useState()

    return <div className="FolderDoc page">
        <div className="Title-Tab">
            {docName}
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

function FolderEdit({doc, setDoc, setTitle})
{
    return <div>

    </div>
}

export { FolderDoc, folderIcon, FolderCreate, FolderEdit }