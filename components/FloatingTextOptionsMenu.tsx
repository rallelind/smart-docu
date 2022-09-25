import { useState, useEffect } from "react"

import { FaMarker, FaPalette } from "react-icons/fa"
import { AiFillMessage } from "react-icons/ai"

const ColorItem = ({ color, onClick }) => {
    return (
        <div onMouseDown={onClick} style={{ backgroundColor: color }} className={`h-4 w-4 rounded-full cursor-pointer z-30`}></div>
    )
}

const FloatingTextOptionsMenu = ({ commentingActive, selectedColor, setSelectedColor }) => {

    const [colorSelectionActive, setColorSelectionActive] = useState(false)

    let selection = document.getSelection()

    let rect = selection.getRangeAt(0).getBoundingClientRect();

    let heightOfFloatingMenu = colorSelectionActive ? 130 : 30 

    let top = `${rect.top + window.scrollY - heightOfFloatingMenu}px` 

    let left = `${rect.left + (rect.width / 2) - 50}px`

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
              selection.removeAllRanges();
              selection.addRange(range);
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
        setSelectedColor(color)
    }

    const messageClick = () => {
        wrapSelectedText()
        commentingActive()
    }

    return (
        <div
            className="absolute"
            style={{ top, left }}
        >
            {colorSelectionActive && (
                <div className="bg-white border-black z-0 border-2 mb-1 grid gap-1 grid-cols-3 justify-items-center p-2 w-[100px] rounded-lg">
                    {colorOptions.map((colorOption) => (
                        <ColorItem onClick={(event) => setColor(event, colorOption)} color={colorOption} />
                        ))
                    }
                </div>
            )

            }

            <span 
                className={`flex justify-evenly bg-black w-[100px] p-1 rounded-lg z-10`}
            >
                <div>
                    <ColorItem color={selectedColor} onClick={colorPalleteOnclick} />
                </div>
                <div onMouseDown={wrapSelectedText} className="cursor-pointer z-10">
                    <FaMarker size={18} color="white" />
                </div>
                <div onMouseDown={messageClick} className="cursor-pointer">
                    <AiFillMessage size={18} color="white" />
                </div>
            </span>
            <div className="flex justify-center z-0">
                <span className="bg-black w-4 h-4 rotate-45 bottom-0 absolute z-0"></span>
            </div>
        </div>
    )
}

export default FloatingTextOptionsMenu