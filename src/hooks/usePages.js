import store from "../modules/store";

function usePages()
{
    const [pages, setPages] = store.useState("pages")

    function addPage(type, attributes)
    {
        const newPages = [...pages]
        newPages.push({
            "type": type,
            "attributes": attributes
        })
        setPages(newPages)
    }

    function goBack()
    {
        const newPages = [...pages]
        newPages.pop()
        setPages(newPages)
    }

    return { addPage, goBack, pages, setPages }
}

export default usePages