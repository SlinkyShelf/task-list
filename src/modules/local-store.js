import { useState, useEffect } from "react";
import store from "./store.js";

function getJsonData(key)
{
    return JSON.parse(localStorage.getItem(key))
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
        setData(getJsonData(docName))
        setGotData(true)
    }, [])

    useEffect(() => {
        if (!gotData) {return}
        storeData(docName, data)
    }, [data])

    return <></>
}

export default LocalStore