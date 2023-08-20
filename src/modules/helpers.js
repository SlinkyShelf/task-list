function ConvertListsPath(path)
{
    const mainSplit = path.split(":")

    if (mainSplit[1] == "")
        return mainSplit[0]+":"
    return mainSplit[0]+":"+"lists."+mainSplit[1].replace(".", ".lists.")
}

function readPath(path, drives)
{
    let data
    let setData

    let target

    console.log(path)

    let pathSplit = path.split(":")
    let drive = pathSplit[0]
    path = pathSplit[1]

    console.log(path)

    if (!drives[drive])
        console.log("Drives have no drive", drive, drives)

    data = JSON.parse(JSON.stringify(drives[drive].data))
    setData = drives[drive].setData

    target = data
    if (path.indexOf(".") != -1)
    {
        const splitPath = path.split(".")
        splitPath.map((p) => {
            target = target[p]
        })
    }

    return { "data": data, "setData": setData, "target": target }
}

export { readPath, ConvertListsPath }