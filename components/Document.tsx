import React, { useState, useEffect } from "react"
import { BsFillArrowRightCircleFill, BsFillArrowLeftCircleFill } from "react-icons/bs"
import { useRouter } from "next/router"

type GeneratedDocument = {
    generatedDocument: [{
        page: number,
        text: string,
    }]
    children: React.ReactNode;
}

const Document: React.FC<GeneratedDocument> = ({ generatedDocument, children }) => {

    const router = useRouter()

    const [page, setPage] = useState(Number(router.query.page))

    useEffect(() => {
      setPage(Number(router.query.page))
    }, [router.query.page])

    const navigateNextPage = () => {
      setPage(page+1)
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