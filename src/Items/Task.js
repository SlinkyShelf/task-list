import { useState } from "react";
import PopupMenu from "../components/PopupMenu/PopupMenu";
import useGlobalData from "../hooks/useGlobalData";

import { TagPicker } from "./Tags";

function CreateTask({frameData, open, setOpen})
{
    const [taskTitle, setTaskTitle] = useState("New Task")
    const [taskTags, setTaskTags] = useState({})

    const {readPath} = useGlobalData()

    return <PopupMenu open={open} setOpen={setOpen}>
        <TagPicker/>
    </PopupMenu>
}

function EditTask({taskPath, setTaskPath})
{
    const {readPath} = useGlobalData()
}   

export {CreateTask, EditTask}