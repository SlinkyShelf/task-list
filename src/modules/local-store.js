import { useState, useEffect } from "react";
import store from "./store.js";

function objClone(obj)
{return JSON.parse(JSON.stringify(obj))}

function setDefault(data)
{
    const newData = objClone(data)
    newData.default = true
    return newData
}

function getJsonData(key)
{
    const raw = localStorage.getItem(key)
    if (raw == null || raw == "")
        return null

    try {
        return JSON.parse(raw)
    } catch(e) {
        return null
    }
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
        if (!data.default) {return;}


        let d = getJsonData(docName)
        if (d != null)
        {
            console.log("Loaded data ", d)
            setData(d)
        } else {
            console.log("No data found!!!")
            setData(objClone(defaultData))
        }
        setGotData(true)
    }, [data])

    useEffect(() => {
        if (!gotData) {return}

        console.log("Stored ", data, " to ", docName)

        if (data == null)
            return console.warn("Data tried to set to null")

        storeData(docName, data)
    }, [data])

    return <></>
}

export { LocalStore, setDefault }