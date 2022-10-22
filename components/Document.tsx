import React, { useState, useEffect } from "react"
import { BsFillArrowRightCircleFill, BsFillArrowLeftCircleFill } from "react-icons/bs"
import { useRouter } from "next/router"


interface GeneratedDocument {
    generatedDocument: [{
        page: number,
        text: string,
    }];
    children: React.ReactNode;
    floatingOptionPlacement: any;
    openSelectionMenu: (value: boolean) => void;
    colorSelectionActive: boolean;
}

const Document: React.FC<GeneratedDocument> = ({ 
  generatedDocument, 
  children, 
  floatingOptionPlacement, 
  openSelectionMenu, 
  colorSelectionActive 
}) => {

    const router = useRouter()

    const [page, setPage] = useState(Number(router.query.page))

    useEffect(() => {
      setPage(Number(router.query.page))
    }, [router.query.page])

    const navigateNextPage = () => {
      setPage(page+1)
      window.scrollTo(0,0)

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
      window.scrollTo(0,0)
      
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

    const mouseUp = () => {
      if(document.getSelection) {                
        let selection = document.getSelection()
        let text = selection.toString()

        if(text !== "") {

          let rect = selection.getRangeAt(0).getBoundingClientRect();
          let start = rect.y
          const topHit = colorSelectionActive ? start < 150 : start < 50;
          let top = topHit ? rect.top + rect.height + window.scrollY : rect.top + window.scrollY
          let left = (rect.left - 100/2) + (rect.width / 2)
          floatingOptionPlacement({top, left, start})
          openSelectionMenu(true)
        }
      }
    }
    
  
    const lastPage = generatedDocument[generatedDocument.length-1].page;
  
    return (
        <div id="document" className='rounded-lg m-5 whitespace-pre-line w-full'>
          {children}
          {generatedDocument.map((text) => (
            <>
              {page === text.page && (
                  <p 
                    key={page}
                    id="document"
                    className='text-center leading-8 text-lg'
                    onMouseUp={mouseUp}
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
    )
}

export default Document