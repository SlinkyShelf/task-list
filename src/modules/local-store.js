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

function LocalStore({docName, storename, defaultData})
{
    const [data, setData] = store.useState(storename)
    const [gotData, setGotData] = useState(false)
    useEffect(() => {
        let d = getJsonData(docName)
        if (d != null)
        {
            console.log("Loaded data ", d)
            setData(d)
        } else {
            console.log("No data found")
            setData(defaultData)
        }
        setGotData(true)
    }, [])

    useEffect(() => {
        if (!gotData) {return}

        console.log("Stored ", data, " to ", docName)

        if (data == null)
            return console.warn("Data tried to set to null")

        storeData(docName, data)
    }, [data])

    return <></>
}

export default LocalStore