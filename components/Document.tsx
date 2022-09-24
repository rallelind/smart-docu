import React, { useState, useEffect, useRef } from "react"
import { BsFillArrowRightCircleFill, BsFillArrowLeftCircleFill } from "react-icons/bs"
import { useRouter } from "next/router"
import FloatingTextOptionsMenu from "./FloatingTextOptionsMenu"

type GeneratedDocument = {
    generatedDocument: [{
        page: number,
        text: string,
    }]
}

const Document: React.FC<GeneratedDocument> = ({ generatedDocument }) => {

    const router = useRouter()

    const [page, setPage] = useState(Number(router.query.page))

    const [selectionOptionsOpen, setSelectionOptionsOpen] = useState(false)

    useEffect(() => {
      const detectDocument = document.querySelector("#document");

      document.addEventListener("pointerdown", (event) => {

        if(detectDocument.contains(event.target as Node)) {
          return
        } else {
          setSelectionOptionsOpen(false)
        }
      })
    }, [])
    
    const selection = () => {

      let selection = document.getSelection()
      let text = selection.toString()

      if(text !== "") {
        setSelectionOptionsOpen(true)
      }
    }

    const removeSelection = () => {

      let selection = document.getSelection()    
      let text = selection.toString()

      if(text !== "") {
        setSelectionOptionsOpen(false)
      }

    }

    useEffect(() => {
      setPage(Number(router.query.page))
    }, [router.query.page])

    const navigateNextPage = () => {
      setPage(page+1)
      setSelectionOptionsOpen(false)
    }
  
    const navigatePageBack = () => {
      setPage(page-1)
      setSelectionOptionsOpen(false)
    }
  
    const lastPage = generatedDocument[generatedDocument.length-1].page;
  
    return (
      <>
        <div id="document" className='shadow-[10px_10px_0px_0px_rgba(0,0,0,0.8)] rounded-lg p-5 m-5 whitespace-pre-line border-2 border-black w-[75%]'>
          {selectionOptionsOpen && <FloatingTextOptionsMenu />}
          {generatedDocument.map((text) => (
            <>
              {page === text.page && (
                  <p 
                    id="text"
                    onPointerUp={selection}
                    onPointerDown={removeSelection}
                    className='text-center leading-8'
                  >
                    {text.text}
                  </p>
                )}
            </>
          ))}
          <div className='flex justify-center m-2 mt-5 items-center'>
            {page !== 1 && <BsFillArrowLeftCircleFill size={20} className='m-2' onClick={navigatePageBack} />}
            <h1 className='m-2'>{`${page}/${lastPage}`}</h1>
            {page !== lastPage && <BsFillArrowRightCircleFill size={20} className='m-2' onClick={navigateNextPage} />}
          </div>
        </div>
      </>
    )
}

export default Document