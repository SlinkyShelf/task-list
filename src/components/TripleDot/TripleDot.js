import "./TripleDot.scss"

function TripleDot({style, onClick, extraClasses})
{
    return <div className={`TripleDot ${extraClasses}`} style={style} onClick={(e) => {
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