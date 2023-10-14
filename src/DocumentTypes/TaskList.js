import DocumentTypes from "../modules/document-types";
import Path from "../components/DocPath/DocPath";
import TripleDot from "../components/TripleDot/TripleDot";
import { TitleEditSection } from "../components/SectionPresets/SectionPresets";
import useDocHelpers from "../hooks/useDocHelpers";
import useGlobalData from "../hooks/useGlobalData";
import { useEffect, useState } from "react";
import { objClone } from "../modules/default-data";
import usePages from "../hooks/usePages";

const icon = "icon-list"

function Doc({docData, docPath, close, frameData})
{
    const [tasks, setTasks] = useState({})
    const [taskEdit, setTaskEdit] = useState()

    const {addPage, goBack} = usePages()

    useEffect(() => {
        const newTasks = {}
        Object.keys(frameData.tasks).map((key) => {
            const task = frameData.tasks[key]

            let valid = false

            Object.keys(task.tags).map((tag) => {
                if (docData.tags[tag] && task.tags[tag])
                    valid = true
            })

            if (valid)
                newTasks[key] = task
        })
        setTasks(newTasks)
    }, [frameData])

    return <div className="FolderDoc page">
        <div className="Title-Tab">
            {docData.title || "Error: No Title"}
            <div className="page-back icon-back" onClick={goBack}/>
        </div>
        <Path path={docPath} frameData={frameData}/>

        <div>
            {Object.keys(tasks).map((key) => {


                return <div key={key} className="AllLists-List Tab">
                    <TripleDot onClick={() => setTaskEdit(key)} extraClasses="cr"/>
                </div>})
            }
        </div>
    </div>
}

function TagPicker({frameData, tags, setTags, openTagEdit})
{
    const [selectedTag, setSelectedTag] = useState()
    const [tagEditOpen, setTagEditOpen] = useState()

    function AddTag()
    {
        if (!selectedTag) {return}

        const newTags = objClone(tags)
        newTags[selectedTag] = true
        setTags(newTags)
    }

    const {addPage, goBack} = usePages()

    function RemoveTag(key)
    {

    }

    return <div className="Section">
        <div className="Section-Header">Tags</div>
        <div>
            {Object.keys(tags).map((key) => {
                return <div className="AllLists-List Tab">
                    {frameData.tags[key].title}
                    <div className="icon-x cr" onClick={() => RemoveTag(key)}/>
                </div>
            })}
        </div>
        <div className="Section-Line">
            <select className="Section-DropDown" value={selectedTag} 
                onChange={(e) => setSelectedTag(e.target.value)}>
                {Object.keys(frameData.tags).map((key) => {
                    return <option value={key}>{frameData.tags[key].title}</option>
                })}
            </select>
            <div className="Section-Button-1" onClick={AddTag}>Add</div>
        </div>
        {(openTagEdit || true) && <div className="Section-Button-1" onClick={() => addPage("")}>EditTags</div>}
        {/* {tagEditOpen && <div className="page">
            <div>Page Test</div>
            </div>} */}
    </div>
}

function Create({create, setTitle, frameData})
{
    const [docTitle, setDocTitle] = useState("New Task List")
    const [tags, setTags] = useState({})

    function make()
    {
        const newTaskList = {
            "title": docTitle,
            "type": "task-list"
        }

        create(newTaskList)
    }

    useEffect(() => {
        setTitle("Create Task List")
    }, [])
    
    return <>
        <TitleEditSection title={docTitle} setTitle={setDocTitle}/>
        <TagPicker frameData={frameData} setTags={setTags} tags={tags}/>
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

const TaskList = {
    "icon": icon,
    "Doc": Doc,
    "Create": Create,
    "Edit": Edit
}

DocumentTypes["task-list"] = TaskList

export default TaskList