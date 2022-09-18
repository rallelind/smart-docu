import React, { useState } from "react"
import { BsFillArrowRightCircleFill, BsFillArrowLeftCircleFill } from "react-icons/bs"

type Document = {
    document: [{
        page: number,
        text: string,
    }]
}

const Document: React.FC<Document> = ({ document }) => {
    const [page, setPage] = useState(1)

    const navigateNextPage = () => {
      setPage(page+1)
    }
  
    const navigatePageBack = () => {
      setPage(page-1)
    }
  
    const lastPage = document[document.length-1].page;
  
    return (
      <div className='shadow-[10px_10px_0px_0px_rgba(0,0,0,0.8)] rounded-lg p-5 m-5 whitespace-pre-line border-2 border-black w-[75%]'>
        {document.map((text) => (
          <>
            {page === text.page && <p className='text-center leading-8'>{text.text}</p>}
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