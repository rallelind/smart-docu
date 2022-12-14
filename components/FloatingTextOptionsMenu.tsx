import { useState, useRef, useEffect, MouseEventHandler, ReactNode, forwardRef } from "react"
import { useRouter } from "next/router"
import { FaMarker, FaPalette } from "react-icons/fa"
import { AiFillMessage } from "react-icons/ai"
import useClickOutside from "../lib/custom-hooks/useClickOutside"
import ColorItem from "./ColorItem"

interface FloatingTextOptionsMenu {
    floatingMenuData: {
        selectedColor: string;
        selectionOptionsOpen: boolean;
        documentTitle: string;
        topPlacement: number,
        leftPlacement: number, 
        startOfAnnotation: number,
        colorSelectionActive: boolean
    }
    children: ReactNode;
    openSelectionMenu: (value: boolean) => void;
    commentingActive: () => void;
    openColorSelection: (value: boolean) => void;
}

const FloatingTextOptionsMenu: React.FC<FloatingTextOptionsMenu> = ({ 
    commentingActive, 
    openSelectionMenu,
    openColorSelection,
    floatingMenuData,
    children 
}) => {

    const floatingMenuRef = useRef()

    const { selectedColor, selectionOptionsOpen, documentTitle, topPlacement, leftPlacement, startOfAnnotation, colorSelectionActive } = floatingMenuData

    useEffect(() => {
        if(!selectionOptionsOpen) {
            let selection = document.getSelection()
            selection.removeAllRanges();
        }
    }, [selectionOptionsOpen])

    useClickOutside(floatingMenuRef, () => {
        if(selectionOptionsOpen) {
            openSelectionMenu(false)
            openColorSelection(false)
        } 
    })

    const colorPalleteOnclick = (event) => {
        event.preventDefault()
        openColorSelection(!colorSelectionActive)
    }

    const highlightOnClick = () => {
        openSelectionMenu(true)
    }

    const wrapSelectedText = async () => {   
        if (window.getSelection) {
          let selection = window.getSelection();
  
          let element = document.createElement("span");
          element.style.backgroundColor = selectedColor
          element.classList.add("select-none", "animate-pulse")

          if (selection.rangeCount) {
            addUserAnnotation(selection, element)
          }
        }
      }

      const addUserAnnotation = async (selection: Selection, element: HTMLSpanElement) => {
        let range = selection.getRangeAt(0).cloneRange();

        const savedNode = range.startContainer;

          const body = {
            highlightStartOffset: range.startOffset,
            highlightEndOffset: range.endOffset,
            highlightTextContent: savedNode.textContent,
            highlightNodeHtml: savedNode.parentElement.innerHTML,
            highlightTagName: savedNode.parentElement.tagName,
            color: selectedColor,
            top: topPlacement, 
            left: leftPlacement,
            start: startOfAnnotation,
          }

          range.surroundContents(element);
          selection.addRange(range)
          selection.removeAllRanges()

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
            element.classList.add("cursor-pointer")
            element.classList.remove("animate-pulse")
            element.onclick = highlightOnClick
        }
          return data
      }

    const onHighlightClick = () => {
        wrapSelectedText()
        openSelectionMenu(false)
    }

    const onMessageClick = () => {
        wrapSelectedText()
        commentingActive()
        openSelectionMenu(true)
    }

    if(!selectionOptionsOpen) {
        return null
    }

    const topHit = colorSelectionActive ? startOfAnnotation < 150 : startOfAnnotation < 50;

    const floatingMenuPlacementStyle = {
        left: leftPlacement,
        top: topHit ? topPlacement + 13 : topPlacement - 50
    }

    const colorSelectionPlacementStyle = {
        left: leftPlacement,
        top: topHit ? topPlacement + 50 : topPlacement - 150
    }

    return (
        <div ref={floatingMenuRef}>
            {colorSelectionActive && (
                <div style={colorSelectionPlacementStyle} className="absolute">
                    <div className="bg-white border-black z-0 border-2 mb-1 grid gap-1 grid-cols-3 justify-items-center p-2 w-[100px] rounded-lg">
                        {children}
                    </div>
                </div>
            )}
            <div
                className="absolute"
                style={floatingMenuPlacementStyle}
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
                    <span className={`bg-gray-800 w-7 h-7 rotate-45 ${topHit ? "top-0" : "bottom-0"} absolute z-0`}></span>
                </div>
            </div>
        </div>
    )
}

export default FloatingTextOptionsMenu