function getAddTypesMenu(setType)
{
    return [
        {"onClick": () => setType("folder"), "iconClass": "icon-folder"},
        {"onClick": () => setType("task-list"), "iconClass": "icon-list"}
    ]
}

export default getAddTypesMenu