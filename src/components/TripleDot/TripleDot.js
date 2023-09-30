import "./TripleDot.scss"

function TripleDot({style, onClick})
{
    return <div className="TripleDot" style={style} onClick={(e) => {
        onClick()
        e.stopPropagation()
        e.preventDefault()
    }}>
        <div className="dot"/>
        <div className="dot"/>
        <div className="dot"/>
    </div>
}

export default TripleDot