import { useEffect, useState } from "react";
import PopupMenu from "../components/PopupMenu/PopupMenu";
import useGlobalData from "../hooks/useGlobalData";

import { TagPicker } from "./Tags";
import { TitleEditSection } from "../components/SectionPresets/SectionPresets";
import { createId, getFramePath } from "../modules/path-functions";
import { objClone } from "../modules/default-data";

function CreateTask({frameData, framePath, open, setOpen, startingTags})
{
    const [taskTitle, setTaskTitle] = useState("New Task")
    const [taskTags, setTaskTags] = useState({})

    const {readPath} = useGlobalData()

    function CreateTask()
    {
        setOpen(false)

        const {target: frameData, data, setData} = readPath(framePath)

        const newId = createId(frameData.tasks)

        const newTask = {
            "title": taskTitle,
            "tags": objClone(taskTags)
        }

        frameData.tasks[newId] = newTask
        setData(data)
    }

    useEffect(() => {
        if (startingTags)
            setTaskTags(objClone(startingTags)) 
    }, [])

    return <PopupMenu open={open} setOpen={setOpen} title="Create Task">
        <TitleEditSection title={taskTitle} setTitle={setTaskTitle}/>
        <TagPicker tags={taskTags} setTags={setTaskTags} frameData={frameData} framePath={framePath}/>
        <div className="Section-Button-1" onClick={CreateTask}>Create</div>
    </PopupMenu>
}

function EditTask({taskPath, setTaskPath})
{
    const [taskTitle, setTaskTitle] = useState("New Task")
    const [taskTags, setTaskTags] = useState({})
    const [frameData, setFrameData] = useState()


    const { readPath, dataUpdates } = useGlobalData()

    useEffect(() => {
        if (!taskPath) {return}

        const {target: task} = readPath(taskPath)
        setTaskTitle(task.title)
        setTaskTags(task.tags)

        const {target: frame} = readPath(getFramePath(taskPath))
        setFrameData(frame)
    }, [...dataUpdates, taskPath])

    function applyEdits()
    {
        const {target: task, data, setData} = readPath(taskPath)
        task.title = taskTitle
        task.tags = taskTags
        setData(data)
        setTaskPath(null)
    }

    return <PopupMenu open={taskPath} setOpen={(v) => v?null:setTaskPath(null)} title={`Edit: ${taskTitle}`}>
        {taskPath && <>
            <TitleEditSection title={taskTitle} setTitle={setTaskTitle}/>
            {frameData && <TagPicker tags={taskTags} setTags={setTaskTags} 
                frameData={frameData} framePath={getFramePath(taskPath)}/>}
            <div className="Section-Button-1" onClick={applyEdits}>Apply Edits</div>
        </>}
    </PopupMenu>
}   

export {CreateTask, EditTask}