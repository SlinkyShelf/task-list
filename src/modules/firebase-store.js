import { getJsonData, storeData } from "./firebasestorage.js";
import { useState, useEffect } from "react";
import store from "./store.js";

function FirebaseStore({coll, docName, storename})
{
    const [data, setData] = store.useState(storename)
    const [gotData, setGotData] = useState(false)
    const [hasUpdates, setHasUpdates] = useState(false)
    const [queueTick, setQueueTick] = useState(0)
    useEffect(() => {
        getJsonData(coll, docName, ).then((d) => {
            if (d)
                setData(d)
            setGotData(true)
        })

        const interval = setInterval(() => setQueueTick(tick => tick+1), 5000)

        return () => {
            clearInterval(interval)
        }
    }, [])

    useEffect(() => {
        if (hasUpdates)
        {
            console.log("Saving")
            setHasUpdates(false)
            storeData(coll, docName, data)
            console.log("saved")
        }
    }, [queueTick])

    useEffect(() => {
        if (!gotData) {return}
        setHasUpdates(true)
    }, [data])

    return <></>
}

export default FirebaseStore