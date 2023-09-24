import "./PopupMenu.scss"

function PopupMenu({children, open, setOpen, title})
{
    return <div className={`PopupMenu-Filter ${open?"open":"closed"}`}>
        <div className={`PopupMenu ${open?"open":"closed"}`}>
            <div className="Popup-Close icon-back" onClick={() => setOpen(false)}/>
            <div className="PopupMenu-Title">{title || "Popup Menu"}</div>
            {children}
        </div>
    </div>
}

export default PopupMenu