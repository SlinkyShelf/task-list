import { useState } from "react"
import useGlobalData from "../../hooks/useGlobalData"

import "./DocumentPage.scss"

function DocumentPage({documentPath})
{
    const {readPath} = useGlobalData()
    const [docData, setDocData] = useState({})
}