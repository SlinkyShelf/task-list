import store from "../../modules/store"
import { createStore, useState } from "state-pool"
import {ActionMenu} from "../../components/ActionMenu/ActionMenu"
import useLongPress from "../../modules/long-press"
import { getListName, getTouchPos, createId } from "../../modules/helpers"
import useGlobalData from "../../hooks/useGlobalData"
import PopupMenu from "../../components/PopupMenu/PopupMenu"

import TripleDot from "../../components/TripleDot/TripleDot"

import "./TagsPage.scss"
import { useEffect, useRef } from "react"
import usePages from "../../hooks/usePages"
import AddButton from "../../components/AddButton/AddButton"
import Path from "../../components/DocPath/DocPath"

import { CreateTag, EditTag, TagTab } from "../../Items/Tags"

function TagsPage({framePath})
{
    const [frameData, setFrameData] = useState({})
    const [frameTags, setFrameTags] = useState({})
    const {readPath, dataUpdates} = useGlobalData()
    const {goBack} = usePages()

    const [newTagOpen, setNewTagOpen] = useState(false)
    const [tagEditPath, setTagEditPath] = useState()

    const addMenu = [
        {"onClick": () => setNewTagOpen(true)}
    ]

    useEffect(() => {
        const {target: frameData} = readPath(framePath) 
        setFrameData(frameData)
        setFrameTags(frameData.tags)
    }, [framePath, ...dataUpdates])

    return <div className="TagsPage page">
        <div className="Title-Tab">
            <span>Tags</span>
            <div className="icon-back left" onClick={goBack}/>
        </div>
        <Path frameData={frameData} path={framePath}/>
        <div className="TagsPage-Tag-List">
            {Object.keys(frameTags).map((key) => {
                const path = framePath+"/tags/"+key
                function edit()
                {
                    setTagEditPath(path)
                }

                return <TagTab tag={frameTags[key]}  edit={edit}
                    path={path} tagId={key} key={key}/>
            })}
        </div>

        <AddButton menu={addMenu}/>

        <CreateTag open={newTagOpen} setOpen={setNewTagOpen} framePath={framePath}/>
        <EditTag tagPath={tagEditPath} setTagPath={setTagEditPath}/>
    </div>
}

export default TagsPage