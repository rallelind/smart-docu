import { useState, useEffect } from "react"

import { FaMarker } from "react-icons/fa"
import { AiFillMessage } from "react-icons/ai"

const FloatingTextOptionsMenu = () => {

    let selection = document.getSelection()

    let rect = selection.getRangeAt(0).getBoundingClientRect();

    let top = `${rect.top + window.scrollY - 35}px` 

    let left = `${rect.left + (rect.width / 2) - 50}px`

    return (
        <div
            className="absolute"
            style={{ top, left }}
        >
            <span 
                className={`flex justify-evenly bg-black w-[100px] p-1 rounded-lg`}
            >
                <FaMarker color="white" />
                <AiFillMessage color="white" />
            </span>
            <div className="flex justify-center">
                <span className="bg-black w-4 h-4 rotate-45 top-3 absolute"></span>
            </div>
        </div>
    )
}

export default FloatingTextOptionsMenu