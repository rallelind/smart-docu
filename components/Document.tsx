import React, { useState, useEffect } from "react"
import { BsFillArrowRightCircleFill, BsFillArrowLeftCircleFill } from "react-icons/bs"
import { useRouter } from "next/router"
import { useQuery } from "react-query"


interface GeneratedDocument {
    generatedDocument: [{
        page: number,
        text: string,
    }];
    documentTitle: string;
    children: React.ReactNode;
}

const Document: React.FC<GeneratedDocument> = ({ generatedDocument, children, documentTitle }) => {

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

    const fetchDocumentHighligths = async () => {
      const res = await fetch(`/api/user-annotations/document-highlights/${documentTitle}`)
      return res.json()
    }
  
    const { data, isSuccess, isLoading } = useQuery("document-highlights", fetchDocumentHighligths)

    const findNode = (annotation) => {
      let documentContent = document.getElementById('document');
      let tagList = documentContent.getElementsByTagName(annotation.highlightTagName);

      for (let tag = 0; tag < tagList.length; tag++) {
        if (tagList[tag].innerHTML == annotation.highlightNodeHtml) {
            let nodeList = tagList[tag].childNodes
            for (let node = 0; node < nodeList.length; node++) {
              if (nodeList[node].textContent == annotation.highlightTextContent) {
                  return nodeList[node];
              }
          }
        }
      }  
    }

    useEffect(() => {
      !isLoading && isSuccess && data.map((userAnnotations) => (
        userAnnotations.userAnnotation.map((annotation) => {

          const foundNode = findNode(annotation)

          let element = document.createElement("span");
          element.style.backgroundColor = annotation.color
          element.classList.add("select-none", "cursor-pointer")


          if(typeof foundNode !== "undefined") {
            const userAnnotationRange = document.createRange()

            userAnnotationRange.setStart(foundNode, annotation.highlightStartOffset)
            userAnnotationRange.setEnd(foundNode, annotation.highlightEndOffset)
            console.log(userAnnotationRange)
            userAnnotationRange.surroundContents(element);
          
          }

        })
      ))
    }, [page, data])
    
  
    const lastPage = generatedDocument[generatedDocument.length-1].page;
  
    return (
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
    )
}

export default Document