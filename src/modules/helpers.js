function getListName(path)
{
    const pathSplit = path.split(".")
    return pathSplit[pathSplit.length-1]
}

function getParentPath(path)
{
    return path.substring(0, path.lastIndexOf("."))
}

function ConvertListsPath(path)
{
    return path.replaceAll(".", ".lists.")
}

function getDrive(path)
{
    return path.split(".")[0]
}

function removeDrive(path)
{
    return path.substring(path.indexOf(".")+1)
}

function readPath(path, drives)
{
    let data, setData, target
    let drive = getDrive(path)
    path = removeDrive(path)

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

function safePath(obj, path, end)
{
    const paths = path.split(".")
    const emptyObj = {}

    paths.map((p) => {
        obj = obj[p] || emptyObj
    })

    if (end && (obj == emptyObj || typeof(obj) != typeof(end)))
        return end

    return obj
}

function getTouchPos(e)
{
    if (e.touches)
        return {"x": e.touches[0].clientX, "y": e.touches[0].clientY}
    return {"x": e.ClientX, "y": e.ClientY}
}

function findName(list, defaultName)
{
    if (!list[defaultName])
        return defaultName

    let newName = defaultName

    let int = 1
    while (list[newName])
    {
        newName = defaultName + " " + int
        int += 1
    }

    return newName
}

export { readPath, ConvertListsPath, getListName, getParentPath, safePath, getTouchPos, findName }