import "./TripleDot.scss"

function TripleDot({style, onClick})
{
    return <div className="TripleDot" style={style} onClick={onClick}>
        <div className="dot"/>
        <div className="dot"/>
        <div className="dot"/>
    </div>
}

export default TripleDot