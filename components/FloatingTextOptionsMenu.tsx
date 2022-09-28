import { useState, useRef, useEffect } from "react"

import { FaMarker, FaPalette } from "react-icons/fa"
import { AiFillMessage } from "react-icons/ai"
import useClickOutside from "../lib/custom-hooks/useClickOutside"

const ColorItem = ({ color, onMouseDown }) => {
    return (
        <div onMouseDown={onMouseDown} style={{ backgroundColor: color }} className={`h-4 w-4 rounded-full cursor-pointer z-30`}></div>
    )
}

const FloatingTextOptionsMenu = ({ commentingActive, selectedColor, onColorChange, onSelectionChange }) => {

    const [colorSelectionActive, setColorSelectionActive] = useState(false)
    const [top, setTop] = useState(Number)
    const [left, setLeft] = useState(Number)

    let selection = document.getSelection()

    useEffect(() => {
        if(selection.toString() !== "") {

            let rect = selection.getRangeAt(0).getBoundingClientRect();
        
            setTop(rect.top + window.scrollY) 
        
            setLeft(rect.left + (rect.width * 0.5))
        }
    }, [selection])

    const colorPalleteOnclick = (event) => {
        event.preventDefault()
        setColorSelectionActive(!colorSelectionActive)
    }

    const wrapSelectedText = () => {   
  
        if (window.getSelection) {
          let selection = window.getSelection();
  
          let element = document.createElement("span");
          element.style.backgroundColor = selectedColor
          element.classList.add("select-none", "cursor-pointer")

          if (selection.rangeCount) {
              let range = selection.getRangeAt(0).cloneRange();

              range.surroundContents(element);
              selection.addRange(range);
              selection.removeAllRanges();
          }
        }
      }

    const colorOptions = [
        "#fdba74",
        "#fde047",
        "#bef264",
        "#86efac",
        "#6ee7b7",
        "#5eead4",
        "#67e8f9",
        "#7dd3fc",
        "#a5b4fc",
        "#d8b4fe",
        "#f0abfc",
        "#f9a8d4",
    ]

    const setColor = (event, color) => {
        event.preventDefault()
        onColorChange(color)
    }

    const onHighlightClick = (event) => {
        event.preventDefault()
        wrapSelectedText()
        onSelectionChange(false)
    }

    const onMessageClick = (event) => {
        event.preventDefault()
        wrapSelectedText()
        commentingActive()
        onSelectionChange(true)
    }

    return (
        <>
            {colorSelectionActive && (
                        <div style={{ top: top - 140, left }} className="absolute">
                <div style={{ top, left }} className="bg-white border-black z-0 border-2 mb-1 grid gap-1 grid-cols-3 justify-items-center p-2 w-[100px] rounded-lg">
                    {colorOptions.map((colorOption) => (
                        <ColorItem onMouseDown={(event) => setColor(event, colorOption)} color={colorOption} />
                        ))
                    }
                </div>
                </div>
            )

            }
        <div
            className="absolute"
            style={{ top: top - 40, left, transform: "translateX(-50%)" }}
        >
            <span 
                className={`flex justify-evenly bg-gray-800 w-[100px] p-2 rounded-lg z-10`}
            >
                <div className="mr-1 ml-1">
                    <ColorItem color={selectedColor} onMouseDown={colorPalleteOnclick} />
                </div>
                <div onMouseDown={onHighlightClick} className="cursor-pointer z-10 ml-1 mr-1">
                    <FaMarker size={18} color="white" />
                </div>
                <div onMouseDown={onMessageClick} className="cursor-pointer ml-1 mr-1">
                    <AiFillMessage size={18} color="white" />
                </div>
            </span>
            <div className="flex justify-center z-0">
                <span className="bg-gray-800 w-7 h-7 rotate-45 bottom-0 absolute z-0"></span>
            </div>
        </div>
        </>
    )
}

export default FloatingTextOptionsMenu