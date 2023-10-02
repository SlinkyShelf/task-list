import { useState } from "react"
import "./AddButton.scss"

function AddButton({menu})
{   
    const [open, setOpen] = useState(false)

    return (menu.length == 1? <div className="ActionButton-Grid">
        <div onClick={menu[0].onClick} className="AddButton">
            <div className={menu[0].iconClass || "AddButton-Icon"}></div>
        </div>
    </div>:<div className="ActionButton-Grid">
        <div onClick={() => setOpen(!open)} className="AddButton">
            <div className="AddButton-Icon"></div>
        </div>
        {open && menu.map((menuItem) => {
            return <div onClick={menuItem.onClick} className="AddButton">
                <div className={menuItem.iconClass || "AddButton-Icon"}></div>
            </div>
        })}
    </div>)
}

export default AddButton