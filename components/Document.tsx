import React, { useState, useEffect, useRef } from "react"
import { BsFillArrowRightCircleFill, BsFillArrowLeftCircleFill } from "react-icons/bs"
import { useRouter } from "next/router"
import FloatingTextOptionsMenu from "./FloatingTextOptionsMenu"

type GeneratedDocument = {
    generatedDocument: [{
        page: number,
        text: string,
    }]
    children: React.ReactNode;
    onSelectionChange: (state: boolean) => void;
}

const Document: React.FC<GeneratedDocument> = ({ generatedDocument, onSelectionChange, children }) => {

    const router = useRouter()

    const [page, setPage] = useState(Number(router.query.page))
    
    const selection = () => {

      if(document.getSelection) {
        let selection = document.getSelection()
        let text = selection.toString()

        if(text !== "") {
          console.log(text)
          console.log("reached")
          onSelectionChange(true)
        }
      }
    }

    const removeSelection = () => {

      if(document.getSelection) {
        let selection = document.getSelection()    
        let text = selection.toString()

        if(text !== "") {
          selection.removeAllRanges();
          onSelectionChange(false)
        }
      }
    }

    useEffect(() => {
      setPage(Number(router.query.page))
    }, [router.query.page])

    const navigateNextPage = () => {
      setPage(page+1)
      onSelectionChange(false)
      return router.push(
        {
          pathname: window.location.pathname,
          query: { 
              page: String(page+1),
          }
        },
        undefined,
        { shallow: true }
      )
    }
  
    const navigatePageBack = () => {
      setPage(page-1)
      onSelectionChange(false)
      
      return router.push(
        {
          pathname: window.location.pathname,
          query: { 
              page: String(page-1),
          }
        },
        undefined,
        { shallow: true }
      )
    }
  
    const lastPage = generatedDocument[generatedDocument.length-1].page;
  
    return (
      <>
        <div id="document" className='rounded-lg m-5 whitespace-pre-line w-full'>
          {children}
          {generatedDocument.map((text) => (
            <>
              {page === text.page && (
                  <p 
                    id="document"
                    onPointerUp={selection}
                    onPointerDown={removeSelection}
                    className='text-center leading-8 text-lg'
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