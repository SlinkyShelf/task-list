import { getJsonData, storeData } from "./firebasestorage.js";
import { useState, useEffect } from "react";
import store from "./store.js";

function FirebaseStore({coll, docName, storename})
{
    const [data, setData] = store.useState(storename)
    const [gotData, setGotData] = useState(false)

    useEffect(() => {
        getJsonData(coll, docName, ).then((d) => {
            if (d)
                setData(d)
            setGotData(true)
        })
    }, [])

    useEffect(() => {
        if (!gotData) {return}

        storeData(coll, docName, data)
    }, [data])

    return <></>
}

export default FirebaseStore