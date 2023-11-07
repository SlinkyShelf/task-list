import { useEffect, useState, useRef } from "react"

function TitleEditSection({title, setTitle})
{
    const [tempTitle, setTempTitle] = useState("")
    const [editTitle, setEditTitle] = useState(false)

    useEffect(() => {
        setTempTitle(title)
    }, [title])

    return <div className="Section">
        <div className="Section-Header">Title</div>
        {editTitle?
        <div className="Section-Line">
            <input className="Section-TextInput" value={tempTitle} 
                onChange={(e) => setTempTitle(e.target.value)}/>
            <div className="Section-Button-1" 
                onClick={() => {setEditTitle(false); setTitle(tempTitle)}}>Apply</div>
        </div>:<div className="Section-Line">
            <div className="Section-Info-1">{title}</div>
            <div className="Section-Button-1" 
                onClick={() => setEditTitle(true)}>Edit</div>
        </div>}
        
    </div>
}

export {TitleEditSection}

const defaultColor = "#FF69B4"

function ColorEditSection({color, setColor, title})
{
    const [newColor, setNewColor] = useState(defaultColor)

    const colorRef = useRef(null)

    useEffect(() => {
        setNewColor(color)
    }, [color])


    return <div className="Section">
        <div className="Section-Header">{title || "Color"}</div>

        <div className="Input-Container">
            <input type="color" className="TagsPage-Tag-Input mr-v" value={newColor} 
                onChange={(e) => setNewColor(e.target.value)} ref={colorRef} />
        </div>

        {newColor == color? 
            <div className="Section-Info-1" style={{"textAlign": "center"}}>
                Click to edit
            </div>
            :
            <div className="Section-Line">
                <div className="Section-Button-1" 
                    onClick={() => {setColor(newColor)}}>
                    Apply
                </div>
                <div className="Section-Button-1" 
                    onClick={() => {setNewColor(color)}}>
                    Cancel
                </div>
            </div>}
    </div>
}

export {ColorEditSection}