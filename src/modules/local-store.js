import { useState, useEffect } from "react";
import store from "./store.js";

function getJsonData(key)
{
    const raw = localStorage.getItem(key)
    if (raw == null || raw == "")
        return null
    return JSON.parse(raw)
}

function storeData(key, data)
{
    return localStorage.setItem(key, JSON.stringify(data))
}

function LocalStore({docName, storename})
{
    const [data, setData] = store.useState(storename)
    const [gotData, setGotData] = useState(false)
    useEffect(() => {
        let d = getJsonData(docName)
        if (d != null)
            setData(d)
        setGotData(true)
    }, [])

    useEffect(() => {
        if (!gotData) {return}
        storeData(docName, data)
    }, [data])

    return <></>
}

export default LocalStore