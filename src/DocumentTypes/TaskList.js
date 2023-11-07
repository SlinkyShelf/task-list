import DocumentTypes from "../modules/document-types";
import Path from "../components/DocPath/DocPath";
import TripleDot from "../components/TripleDot/TripleDot";
import { TitleEditSection } from "../components/SectionPresets/SectionPresets";
import useDocHelpers from "../hooks/useDocHelpers";
import useGlobalData from "../hooks/useGlobalData";
import { useEffect, useState } from "react";
import { objClone } from "../modules/default-data";
import usePages from "../hooks/usePages";
import EditDoc from "../components/EditDoc/EditDoc";
import AddButton from "../components/AddButton/AddButton";
import { getFramePath } from "../modules/path-functions";
import { TagPicker } from "../Items/Tags";

import { CreateTask, EditTask } from "../Items/Task";

const icon = "icon-list"

function Doc({docData, docPath, close, frameData, framePath})
{
    const [tasks, setTasks] = useState({})
    const [taskEdit, setTaskEdit] = useState()
    const [editDoc, setEditDoc] = useState()
    const [taskCreateOpen, setTaskCreateOpen] = useState()

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

    const addMenu = [
        {"onClick": () => setTaskCreateOpen(true)},
        {"onClick": () => setEditDoc(docPath), "iconClass": "icon-settings"}
    ]

    return <div className="FolderDoc page">
        <div className="Title-Tab">
            {docData.title || "Error: No Title"}
            <div className="page-back icon-back" onClick={goBack}/>
        </div>
        <Path path={docPath} frameData={frameData}/>
        <div>
            {Object.keys(tasks).map((key) => {
                const task = tasks[key]

                return <div key={key} className="AllLists-List Tab">
                    {task.title}
                    <TripleDot onClick={() => setTaskEdit(framePath+"/tasks/"+key)} extraClasses="cr"/>
                </div>})
            }
        </div>
        
        <AddButton menu={addMenu}/>
        <CreateTask open={taskCreateOpen} setOpen={setTaskCreateOpen} 
            frameData={frameData} framePath={framePath} startingTags={docData.tags}/>
        <EditTask taskPath={taskEdit} setTaskPath={setTaskEdit} />
        <EditDoc frameData={frameData} docPath={editDoc} setDocPath={setEditDoc}/>
    </div>
}

function Create({create, setTitle, frameData, dirPath})
{
    const [docTitle, setDocTitle] = useState("New Task List")
    const [tags, setTags] = useState({})
    const {addPage} = usePages()

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
        <TagPicker framePath={getFramePath(dirPath)} frameData={frameData} setTags={setTags} tags={tags}/>
        <div className="Section-Button-1" onClick={make}>Create</div>
    </>
}

function Edit({doc, setDoc, setTitle, docPath, close, frameData})
{
    const [docTitle, setDocTitle] = useState("Loading...")
    const [tags, setTags] = useState({})
    const {addPage} = usePages()

    const {deletePath} = useDocHelpers()

    useEffect(() => {
        setTitle("Edit: "+doc.title)
        setDocTitle(doc.title)
        setTags(doc.tags)
    }, [doc])

    function applyEdits()
    {
        const newDoc = objClone(doc)
        newDoc.title = docTitle
        newDoc.tags = objClone(tags)
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
        <TagPicker  setTags={setTags} tags={tags}
            framePath={getFramePath(docPath)} frameData={frameData}/>
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