import "./ListPage.scss"
import store from "../../modules/store"
import { useState } from "react"

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

// function NewItem()
// {   
//     const [ itemName, setItemName ] = useState("")
//     const [ isFolder, setIsFolder ] = useState(false)

//     function toggle()
//     {
//         setIsFolder(!isFolder)
//     }

//     return <div className="List-Page-New-Item">
//         {isFolder? <div className="List-Page-Tab-Folder-Icon New-Item-Icon" onClick={toggle}/>
//             :<div className="List-Page-Tab-List-Icon New-Item-Icon" onClick={toggle}/>}


//         <input type="text" className="List-Page-New-Item-Input" 
//             value={itemName} onChange={(e) => setItemName(e.target.value)}/>

//         {/* <div className={`List-Page-Tab-Folder-Icon ${!isFolder && "not-selected"}`} />
//         <div className={`List-Page-Tab-List-Icon ${isFolder && "not-selected"}`} /> */}
//     </div>
// }

function ActionList()
{
    return <div>

    </div>
}

function HoldWrapper({ children, onClick, onHold })
{
    const [holdTimer, setHoldTimer] = useState()

    function pDown()
    {
        const t = setTimeout(() => {

        }, 1000)
        setHoldTimer(t)
    }

    function pUp()
    {
        if (holdTimer)
        {
            clearTimeout(holdTimer);
            setHoldTimer(null)
        }
    }

    return <div onPointerDown={pDown} onPointerUp={pUp}>
        {children}
    </div>
}

function ListTab({list, listName, depth})
{
    depth = depth || 0
    const [open, setOpen] = useState(false)

    return <div className="List-Page-Tab-Container">
        {list.type == "folder" && <div className="List-Page-Folder List-Page-Tab">
            <div className="List-Page-Title" onClick={() => setOpen(!open)} >
                <div className="List-Page-Tab-Folder-Icon" />
                {listName}
                {depth > 0 &&  <div className="Down-Line-Side"/>}
            </div>
            {open && <div className="List-Page-Folder-List">
                {Object.keys(list.lists).map((lName) => {
                    return <ListTab list={list.lists[lName]} listName={lName} key={lName} depth={depth+1}/>
                })}
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