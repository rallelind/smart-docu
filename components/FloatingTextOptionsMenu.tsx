import { useState, useRef, useEffect, MouseEventHandler } from "react"
import { useRouter } from "next/router"
import { FaMarker, FaPalette } from "react-icons/fa"
import { AiFillMessage } from "react-icons/ai"
import useClickOutside from "../lib/custom-hooks/useClickOutside"
import colorOptions from "../lib/color-data/color-options"

interface ColorItem {
    color: string;
    onMouseDown: MouseEventHandler;
}

interface FloatingTextOptionsMenu {
    commentingActive: () => void;
    selectedColor: string;
    onColorChange: (value: string) => void;
    documentTitle: string;
}

const ColorItem: React.FC<ColorItem> = ({ color, onMouseDown }) => {
    return (
        <div 
            style={{ backgroundColor: color }} 
            onMouseDown={onMouseDown} 
            className={`h-4 w-4 rounded-full cursor-pointer z-30`}>
        </div>
    )
}

const FloatingTextOptionsMenu: React.FC<FloatingTextOptionsMenu> = ({ 
    commentingActive, 
    selectedColor, 
    onColorChange, 
    documentTitle 
}) => {

    const [colorSelectionActive, setColorSelectionActive] = useState(false)
    const [selectionOptionsOpen, setSelectionOptionsOpen] = useState(false)
    const [top, setTop] = useState(Number)
    const [left, setLeft] = useState(Number)

    const floatingMenuRef = useRef()

    useEffect(() => {
        const documentElement = document.querySelector("#document");

        const mouseUp = () => {
            if(document.getSelection) {                
              let selection = document.getSelection()
              let text = selection.toString()
      
              if(text !== "") {
                let rect = selection.getRangeAt(0).getBoundingClientRect();
                setTop(rect.top + window.scrollY) 
                setLeft((rect.left - 100/2) + (rect.width / 2))
                setSelectionOptionsOpen(true)
              }
            }
          }

        documentElement.addEventListener("mouseup", mouseUp)

        return () => {
            documentElement.removeEventListener("mouseup", mouseUp)
        }
    }, [])

    useEffect(() => {
        if(!selectionOptionsOpen) {
            let selection = document.getSelection()
            selection.removeAllRanges();
        }
    }, [selectionOptionsOpen])

    useClickOutside(floatingMenuRef, () => {
        if(selectionOptionsOpen) {
            setSelectionOptionsOpen(false)
            setColorSelectionActive(false)
        } 
    })

    const colorPalleteOnclick = (event) => {
        event.preventDefault()
        setColorSelectionActive(!colorSelectionActive)
    }

    const wrapSelectedText = async () => {   
        if (window.getSelection) {
          let selection = window.getSelection();
  
          let element = document.createElement("span");
          element.style.backgroundColor = selectedColor
          element.classList.add("select-none", "cursor-pointer")

          if (selection.rangeCount) {
            addUserAnnotation(selection, element)
          }
        }
      }

      const addUserAnnotation = async (selection: Selection, element: Element) => {
        let range = selection.getRangeAt(0).cloneRange();

        const savedNode = range.startContainer;

        console.log(savedNode.parentElement.innerHTML)

          const body = {
            highlightStartOffset: range.startOffset,
            highlightEndOffset: range.endOffset,
            highlightTextContent: savedNode.textContent,
            highlightNodeHtml: savedNode.parentElement.innerHTML,
            highlightTagName: savedNode.parentElement.tagName,
            color: selectedColor,
          }

          const createUserAnnotation = await fetch(`/api/user-annotations/highlight/${documentTitle}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(body)
          })

          const data = await createUserAnnotation.json()

          if(createUserAnnotation.ok) {
            range.surroundContents(element);
            selection.addRange(range)
            selection.removeAllRanges()
          }
          return data
      }

    const setColor = (event, color: string) => {
        event.preventDefault()
        onColorChange(color)
    }

    const onHighlightClick = () => {
        wrapSelectedText()
        setSelectionOptionsOpen(false)
    }

    const onMessageClick = () => {
        wrapSelectedText()
        commentingActive()
        setSelectionOptionsOpen(true)
    }

    if(!selectionOptionsOpen) {
        return null
    }

    return (
        <div ref={floatingMenuRef}>
            {colorSelectionActive && (
                <div style={{ top: top - 150, left }} className="absolute">
                    <div style={{ top, left }} className="bg-white border-black z-0 border-2 mb-1 grid gap-1 grid-cols-3 justify-items-center p-2 w-[100px] rounded-lg">
                        {colorOptions.map((colorOption) => (
                            <ColorItem 
                                onMouseDown={(event) => setColor(event, colorOption)} 
                                color={colorOption} 
                            />
                        ))}
                    </div>
                </div>
            )}
            <div
                className="absolute"
                style={{ top: top - 50, left }}
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
        </div>
    )
}

export default FloatingTextOptionsMenu