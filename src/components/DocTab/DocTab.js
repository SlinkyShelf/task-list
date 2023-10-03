import "./DocTab.scss"
import TripleDot from "../TripleDot/TripleDot"

function DocTab({docName, docData, open, edit})
{
    let iconClass = ""
    switch (docData.type)
    {
        case "folder":
            iconClass = "icon-folder"
            break
        case "task-list":
            iconClass = "icon-list"
            break
    }

    return <div className="AllLists-Tab-Container">

        <div className="AllLists-List Tab" onClick={open || (() => {})}>
            <div className={`${iconClass} mr-r`} />
            {docData.title || "Error: No Title"}
            <TripleDot onClick={edit || (() => {})} extraClasses={"cr"}/>
        </div>
    </div>
}

export default DocTab

// [[ Old Action Menu Code ]]

// const [actionMenu, setActionMenu] = listPageStore.useState("action-menu")

// const longPressEvent = useLongPress(
//     (e) => {
//         const menu = {...actionMenu}
//         menu.type = list.type
//         menu.path = path
//         menu.open = true
//         menu.pos = getTouchPos(e)
//         setActionMenu(menu)
//     }, 
//     () => {
//         if (list.type == "folder")
//         {
//             console.log(path)
//             setDirPath(path)

//         }
//         else if (list.type == "list")
//         {
//             // setListPath(path)
//             // setCurrentPage("list")
//         }
    //     });