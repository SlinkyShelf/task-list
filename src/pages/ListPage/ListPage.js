import "./ListPage.scss"
import store from "../../modules/store"

import { readPath, ConvertListsPath, getListName } from "../../modules/helpers"
import { useEffect, useState } from "react"

function ListPage()
{
    const [firebaseUserData, setFirebaseUserData] = store.useState("firebase-user-data")
    const [currentPage, setCurrentPage] = store.useState("current-page")
    const [listPath, setListPath] = store.useState("list-path")
    const [editPath, setEditPath] = store.useState("list-edit-path")

    const [listTitle, setListTitle] = useState("")
    const [list, setList] = useState({})

    const drives = {
        "Firebase": {
            "data": firebaseUserData,
            "setData": setFirebaseUserData
        }
    }

    useEffect(() => {
        let {data, setData, target} = readPath(ConvertListsPath(listPath), drives)
        setList(target)

        setListTitle(getListName(listPath))
    }, [listPath, firebaseUserData])

    return <div className="ListPage">
        <div className="List-Edit-Header">
            {listTitle}
            <div className="icon-back top-left" onClick={() => setCurrentPage("all-lists")}/>
            <div className="icon-edit top-right" onClick={() => {
                setEditPath(listPath)
                setCurrentPage("list-edit")
                }}/>
        </div>
    </div>
}

export default ListPage