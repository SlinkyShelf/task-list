import { convertToLightPath } from "../../modules/path-functions"

function Path({path, frameData})
{
    function generatePathDisplay()
    {
        const display = []
        const lightPath = convertToLightPath(path)
        let frameSet = frameData.documents

        lightPath.map((p) => {
            display.push("/")
            display.push(frameSet[p].title)
            frameSet = frameSet[p].dir
        })

        return display
    }

    return <div className="DocumentPage-Path">
        {/* Temp */}
        <span>{frameData.title}</span>
        {generatePathDisplay().map((dis, i) => {
            return (dis == "/"?<span key={i}>/</span>:
            <span key={i}>{dis}</span>)
        })}
    </div>
}

export default Path