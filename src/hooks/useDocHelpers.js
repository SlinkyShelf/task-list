import useGlobalData from "../hooks/useGlobalData";
import { getLastId, popId } from "../modules/path-functions";

function useDocHelpers()
{   
    const {readPath} = useGlobalData()

    function deletePath(path)
    {
        const id = getLastId(path)
        const popedPath = popId(path)

        const {data, setData, target} = readPath(popedPath)
        delete target[id]
        setData(data)
    }

    return {
        "deletePath": deletePath
    }
}

export default useDocHelpers