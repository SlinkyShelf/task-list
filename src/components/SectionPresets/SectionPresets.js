import { useEffect, useState } from "react"

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