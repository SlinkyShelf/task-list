import { useState, useCallback } from "react"
import store from "../modules/store"


function objClone(obj)
{return JSON.parse(JSON.stringify(obj))}

function useGlobalData()
{
    const [firebaseUserData, setFirebaseUserData, updateFirebaseData] = store.useState("user-data")
    const [user] = store.useState("user")

    const dataUpdates = [firebaseUserData]

    const readPath = useCallback((path) => {
        const drives = {
            "firebase": {
                "data": firebaseUserData,
                "setData": setFirebaseUserData,
                "updateData": updateFirebaseData
            },
        }


        const driveSplit = path.split(":")
        const driveArgs = driveSplit[0].split(".")
        const driveName = driveArgs[0]

        if (!drives[driveName])
            console.warn("Invalid Drive: \""+driveName+"\" in \""+path+"\"")

        const driveData = objClone(drives[driveName].data)
        let target = driveData

        const pathSplit = driveSplit[1].split("/")
        for (let i = 0; i < pathSplit.length; i++)
        {
            if (pathSplit[i] == "")
                continue

            if (target[pathSplit[i]])
                target = target[pathSplit[i]]
            else
            {
                console.warn("Missing Path: \""+pathSplit[i]+"\" in \""+path+"\"")
                break 
            }
        }

        return {
            "data": driveData, 
            "target": target, 
            "setData": drives[driveName].setData, 
            "updateData": drives[driveName].updateData
        }
        
    }, [ firebaseUserData ])

    return { 
        readPath, 
        dataUpdates, 

        firebaseUserData,
        setFirebaseUserData,
        updateFirebaseData
    }
}

export default useGlobalData