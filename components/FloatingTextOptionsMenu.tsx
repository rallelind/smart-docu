import { useState, useEffect } from "react"

import { FaMarker } from "react-icons/fa"
import { AiFillMessage } from "react-icons/ai"

const FloatingTextOptionsMenu = () => {

    let selection = document.getSelection()

    let rect = selection.getRangeAt(0).getBoundingClientRect();

    let top = `${rect.top + window.scrollY - 30}px` 

    let left = `${rect.left + (rect.width / 2) - 50}px`

    const wrapSelectedText = () => {        
        if (window.getSelection) {
          let selection = window.getSelection();
  
          let element = document.createElement("span");
          element.style.backgroundColor = "yellow";
          element.style.userSelect = "none"

          console.log(selection.toString())
  
          if (selection.rangeCount) {
              let range = selection.getRangeAt(0).cloneRange();

              range.surroundContents(element);
              selection.removeAllRanges();
              selection.addRange(range);

          }
        }
      }

    return (
        <div
            className="absolute"
            style={{ top, left }}
        >
            <span 
                className={`flex justify-evenly bg-black w-[100px] p-1 rounded-lg`}
            >
                <div onMouseDown={wrapSelectedText} className="cursor-pointer">
                    <FaMarker size={18} color="white" />
                </div>
                <AiFillMessage size={18} color="white" />
            </span>
            <div className="flex justify-center">
                <span className="bg-black w-4 h-4 rotate-45 top-3 absolute"></span>
            </div>
        </div>
    )
}

export default FloatingTextOptionsMenu