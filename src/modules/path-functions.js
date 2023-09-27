function getLastId(path)
{
    const driveSplit = path.split(":")
    const namesSplit = driveSplit[1].split("/")
    return namesSplit[namesSplit.length-1]
}

function popId(path)
{
    const driveSplit = path.split(":")
    return driveSplit[0]+":"+driveSplit[1].substring(0, driveSplit[1].lastIndexOf("/"))
}

function getDrive(path)
{
    const driveSplit = path.split(":")
    return driveSplit[0].split(".")[0]
}

export {getDrive, popId, getLastId}