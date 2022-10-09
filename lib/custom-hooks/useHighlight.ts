import { useState, useRef } from "react"

const useHighlight = () => {

    //const [foundElement, setFoundElement] = useState<Element>(null)
    //const [foundNode, setFoundNode] = useState<ChildNode>(null)

    let foundElement = useRef(null)
    let foundNode = useRef(null)

    let startOffset = useRef(null);
    let endOffset = useRef(null);

    let selectionExists = 
    
    if(typeof window !== "undefined" && ) {

    const selection = window.getSelection()

    let range = selection.getRangeAt(0).cloneRange();

    startOffset.current = range.startOffset;
    endOffset.current = range.endOffset;

    const savedNode = range.startContainer;

    const textContent = savedNode.textContent
  
    const nodeHtml = savedNode.parentElement.innerHTML

    const tagName = savedNode.parentElement.tagName

    let documentContent = document.getElementById('document');
    let tagList = documentContent.getElementsByTagName(tagName);

    for (let i = 0; i < tagList.length; i++) {
        if (tagList[i].innerHTML == nodeHtml) {
            foundElement.current = tagList[i];
        }
    }

        let nodeList = foundElement.current.childNodes;
        for (let i = 0; i < nodeList.length; i++) {
            if (nodeList[i].textContent == textContent) {
                foundNode.current = nodeList[i];
            }
        }
    }

    return {
        foundNode,
        startOffset,
        endOffset,
    }
}

export default useHighlight