import { getJsonData, storeData } from "./firebasestorage.js";
import { useState, useEffect } from "react";
import store from "./store.js";

function FirebaseStore({coll, key, storename})
{
    const [data, setData] = store.useState(storename)
    const [gotData, setGotData] = useState(false)

    useEffect(() => {
        getJsonData(coll, key).then((d) => {
            if (d)
                setData(d)
            setGotData(true)
        })
    }, [])

    useEffect(() => {
        if (!gotData) {return}

        storeData(coll, key)
    }, [data])

    return <></>
}

export default FirebaseStore