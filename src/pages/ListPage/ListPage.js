import "./ListPage.scss"
import store from "../../modules/store"
import { useState } from "react"

import useLongPress from "../../modules/long-press";

import {createStore } from 'state-pool';

const listPageStore = createStore();
listPageStore.setState("selected-path", null)

const colorDepth = ["red", "green", "blue", "orange"]

function safePath(obj, path, end)
{
    const paths = path.split(".")
    const emptyObj = {}

    paths.map((p) => {
        obj = obj[p] || emptyObj
    })

    if (end && (obj == emptyObj || typeof(obj) != typeof(end)))
        return end

    return obj
}

function NewItem({type})
{   
    const [ itemName, setItemName ] = useState("")

    return <div className="List-Page-New-Item">
        {type == "list" && <div className="List-Page-Tab-List-Icon New-Item-Icon"/>}
        {type == "folder" && <div className="List-Page-Tab-Folder-Icon New-Item-Icon"/>}


        <input type="text" className="List-Page-New-Item-Input" 
            value={itemName} onChange={(e) => setItemName(e.target.value)}/>

        {/* <div className={`List-Page-Tab-Folder-Icon ${!isFolder && "not-selected"}`} />
        <div className={`List-Page-Tab-List-Icon ${isFolder && "not-selected"}`} /> */}
    </div>
}

function HoldWrapper({ children, onClick, onHold })
{
    const [holdTimer, setHoldTimer] = useState()
    const [usedHold, setUsedHold] = useState(false)

    function pDown()
    {
        const t = setTimeout(() => {
            onHold()
            setUsedHold(true)
        }, 1000)
        setHoldTimer(t)
    }

    function pUp(e)
    {
        e.preventDefault()
        if (holdTimer)
        {
            clearTimeout(holdTimer);
            setHoldTimer(null)
        }

        if (!usedHold) {
            onClick()
        }

        

        setUsedHold(false)
    }

    return <div onPointerDown={pDown} onPointerUp={pUp} >
        {children}
    </div>
}

function CreateMenu({Options, open, setOpen})
{
    return (open && <div className="List-Page-Create-Menu">
        {Object.keys(Options).map((key) => {
            return <div className="List-Page-Create-Menu-Option" key={key} onClick={() => {
                setOpen(false)
                Options[key]()
            }}>
                {key}
            </div>
        })}
    </div>)
}

function ListTab({list, listName, depth})
{
    depth = depth || 0
    const [open, setOpen] = useState(false)
    const [createMenu, setCreateMenu] = useState(false)
    const [createType, setCreateType] = useState(null)
    // const [selectedPath, setSelectedPath ] = listPageStore.useState("selected-path")

    function CreateList()
    {
        setCreateType("List")
    }

    function CreateFolder()
    {

    }

    return <div className="List-Page-Tab-Container">
        {list.type == "folder" && <div className="List-Page-Folder List-Page-Tab">
            <HoldWrapper onClick={() => setOpen(!open)} onHold={() => setCreateMenu(true)}><div className="List-Page-Title" >
                <div className="List-Page-Tab-Folder-Icon" />
                {listName}
                {depth > 0 &&  <div className="Down-Line-Side"/>}
                <CreateMenu open={createMenu} setOpen={setCreateMenu} Options={{
                    "New List": CreateList,
                    "New Folder": CreateFolder,
                }}/>
            </div></HoldWrapper>
            {open && <div className="List-Page-Folder-List">
                {Object.keys(list.lists).map((lName) => {
                    return <ListTab list={list.lists[lName]} listName={lName} key={lName} depth={depth+1}/>
                })}
                {createType && <NewItem type={createType}/>}
            </div>}
            <div className="Down-Line-Up-Test"/>
        </div>}

        {list.type == "list" && <div className="List-Page-List List-Page-Tab">
            {/* <div className="List-Page-Tab-List-Icon" /> */}
            {listName}
            {depth > 0 &&  <div className="Down-Line-Side"/>}
            {depth > 0 &&  <div className="Down-Line-Up"/>}
        </div>}
    </div>
}

function SourceTab({source})
{
    return <div className="List-Page-Source-Tab">
        {source}
        <div className="bottom-border"/>
    </div>
}

function ListPage()
{
    const [userData] = store.useState("firebase-user-data")

    const [selectedPath, setSelectedPath] = listPageStore.useState("selected-path")

    return <div className="ListPage">
        <SourceTab source={"Firebase"}/>
        <div className="List-Page-List-Table">
            {Object.keys(safePath(userData, "lists")).map((listName) => {
                return <ListTab listName={listName} list={userData.lists[listName]} key={listName}/>
            })}
        </div>
    </div>
}

export default ListPage