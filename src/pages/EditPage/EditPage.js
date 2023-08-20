import "./EditPage.scss"
import store from "../../modules/store"

function EditPage()
{
    const [editPath, setEditPath] = store.useState("edit-path")

    return <div className="Create-Page">
        <div className="Create-Page-Header">Create</div>
    </div>
}

export default EditPage