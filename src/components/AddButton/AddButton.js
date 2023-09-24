import "./AddButton.scss"

function AddButton({onClick})
{   
    return <div onClick={onClick} className="AddButton">
        <div className="AddButton-Icon"></div>
    </div>
}

export default AddButton