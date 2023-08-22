import { useEffect, useState, useRef } from "react"

import "./ActionMenu.scss"

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }

function ActionMenu({Options, open, setOpen, pos})
{
    const ref = useRef()
    const [positionStyle, setPositionStyle] = useState({})

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
        let x = Math.min(pos.x, wind.width - menuWidth)
        let y = Math.min(pos.y, wind.height - menuHeight)
        setPositionStyle({"left": x+"px", "top": y+"px"})
    }

    useEffect(() => {
        function uP()
        {UpdatePosition()}

        window.addEventListener('resize', uP);
        return () => window.removeEventListener('resize', uP);
    }, [])

    useEffect(UpdatePosition, [pos])

    return (<div className="Action-Menu" ref={ref} style={{...positionStyle, "display": open?"block":"none"}}>
        {Object.keys(Options).map((key) => {
            return <div className="Action-Menu-Option" key={key} onTouchEnd={(e) => {
                setOpen(false)
                Options[key]()
                e.preventDefault()
            }}>
                {key}
            </div>
        })}
    </div>)
}


export default ActionMenu