import "./ListPage.scss"
import store from "../../modules/store"

import { readPath, ConvertListsPath, getListName } from "../../modules/helpers"
import { useEffect, useState } from "react"

function ListPage()
{
    const [firebaseUserData, setFirebaseUserData] = store.useState("firebase-user-data")
    const [currentPage, setCurrentPage] = store.useState("current-page")
    const [listPath, setListPath] = store.useState("list-path")

    const [listTitle, setListTitle] = useState("")
    const [list, setList] = useState([])

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
    }, [])

    return <div className="ListPage">
        <div className="ListPage-Title">{listTitle}</div>
    </div>
}

export default ListPage