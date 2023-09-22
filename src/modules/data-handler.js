import store from "./store"
import { useState, useCallback, useEffect } from "react"

function getDrive(path)
{
    return path.split(".")[0]
}

function removeDrive(path)
{
    const c = path.split(".")
    c.shift()
    return c.join(".")
}

function rawClone(data)
{
    return JSON.parse(JSON.stringify(data))
}

function useGlobalData()
{
    const [firebaseUserData, setFirebaseUserData] = store.useState("firebase-user-data")

    const readData = useCallback((path) =>
    {
        const drives = {
            "Firebase": {
                "data": firebaseUserData,
                "setData": setFirebaseUserData
            }
        }

        return readPath(path, drives)
    }, [firebaseUserData])

    const dataUpdates = [firebaseUserData]

    return { readData, dataUpdates }
}

function readPath(path, drives)
{
    let data, setData, target
    let drive = getDrive(path)
    path = removeDrive(path)

    if (!drives[drive])
        console.log("Drives have no drive", drive, drives)

    data = rawClone(drives[drive].data)
    setData = drives[drive].setData

    target = data
    const splitPath = path.split(".")
    splitPath.map((p) => {
        if (p == "")
            return;
        target = target[p]
    })

    return { "data": data, "setData": setData, "target": target }
}

function useUpdates()
{   
    const updateLocal = useCallback(() => {

    }, [])
}

export { readPath, useGlobalData, rawClone, useUpdates }