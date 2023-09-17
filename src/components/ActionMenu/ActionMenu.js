import { useEffect, useState, useRef } from "react"

import "./ActionMenu.scss"

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }

function ActionMenu({setState, state, options})
{
    const ref = useRef()
    const [positionStyle, setPositionStyle] = useState({})

    options = {...options, "none": {}}

    function setOpen(toggle)
    {
        const newState = {...state}
        newState.open = toggle
        setState(newState)
    }

    useEffect(() => {
        function outsideClick(e)
        {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false)
            }
        }

        document.addEventListener("pointerdown", outsideClick)

        return () => {
            document.removeEventListener("pointerdown", outsideClick);
          };
    }, [])

    function UpdatePosition()
    {
        if (!ref.current)
            return

        const wind = getWindowDimensions()
        const menuWidth = ref.current.clientWidth
        const menuHeight = ref.current.clientHeight
        let x = Math.min(state.pos.x, wind.width - menuWidth)
        let y = Math.min(state.pos.y, wind.height - menuHeight)
        setPositionStyle({"left": x+"px", "top": y+"px"})
    }

    useEffect(() => {
        function uP()
        {UpdatePosition()}

        window.addEventListener('resize', uP);
        return () => window.removeEventListener('resize', uP);
    }, [])

    useEffect(UpdatePosition, [state])

    const style = {...positionStyle, "display": state.open?"block":"none"}

    return (<div className="Action-Menu" ref={ref} style={style}>
        {Object.keys(options[state.type]).map((key) => {
            return <div className="Action-Menu-Option" key={key} onTouchEnd={(e) => {
                setOpen(false)
                options[state.type][key]()
                e.preventDefault()
            }}>
                {key}
            </div>
        })}
    </div>)
}

function ActionMenuState()
{
    return {
        "task": "",
        "pos": {"x": 0, "y": 0},
        "type": "none",
        "open": false
    }
}

function useActionMenu(pageStore)
{
    const [actionMenu, setActionMenu] = pageStore.useState("action-menu")

    

    return { actionMenu, setActionMenu }
}

export { ActionMenu, ActionMenuState }