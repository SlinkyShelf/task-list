import { convertToLightPath, getLastId } from "../../modules/path-functions"
import usePages from "../../hooks/usePages"

function Slash()
{
    return <span className="slash">/</span>
}

function Path({path, frameData})
{
    const {pages, setPages} = usePages()

    function generatePathDisplay()
    {
        const display = []
        const lightPath = convertToLightPath(path)
        let frameSet = frameData.documents

        if (lightPath.length == 0)
            display.push(["/"])

        lightPath.map((p) => {
            display.push(["/"])
            display.push([frameSet[p].title, p])
            frameSet = frameSet[p].dir
        })

        return display
    }

    function returnToFrame()
    {
        setPages([pages[0]])
    }

    function returnToPath(path)
    {
        const newPages = []
        for (let i = 0; i < pages.length; i++)
        {
            newPages.push(pages[i])
            if (pages[i].type != "document")
                continue

            if (getLastId(pages[i].attributes.documentPath) == path)
                break
        }

        setPages(newPages)
    }

    return <div className="DocumentPage-Path">
        {/* Temp */}
        <span onClick={returnToFrame}>{frameData.title}</span>
        {generatePathDisplay().map((dis, i) => {
            return (dis[0] == "/"?<Slash key={i}/>:
            <span key={i} onClick={() => returnToPath(dis[1])}>{dis[0]}</span>)
        })}
    </div>
}

export default Path