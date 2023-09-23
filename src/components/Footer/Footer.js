import "./Footer.scss"
import { useState } from "react";

import store from "../../modules/store";

function Footer()
{
    const [currentPage, setCurrentPage] = useState("")

    return <div className="Footer">
        <div className="Footer-Section">
            <div className="icon-folder" onClick={() => setCurrentPage("all-lists")}></div>
        </div>
        <div className="Footer-Section">
            <div className="icon-calender" onClick={() => setCurrentPage("calendar")}></div>
        </div>
        <div className="Footer-Section">
            <div className="icon-settings" onClick={() => setCurrentPage("settings")}></div>
        </div>
    </div>
}

export default Footer