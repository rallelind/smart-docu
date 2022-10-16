import { useState } from "react"

import { RiArrowDownSLine, RiArrowUpSLine, RiPagesLine } from "react-icons/ri"
import { useRouter } from "next/router"
import { HiOutlineDocument, HiOutlineDocumentDuplicate, HiOutlineCloudUpload } from "react-icons/hi"
import { useGetDocumentsList } from "../../lib/custom-hooks/react-queries"

const SideNavBar = () => {

    const [documentsOpened, setDocumentsOpened] = useState(false)
    const [currentDocumentOpen, setCurrentDocumentOpen] = useState("")

    const router = useRouter()

    const routerRedirect = (path: string) => {
        router.push(
            {
                pathname: path,
            },
            undefined,
            { shallow: true }
        )
    }

    const openDocumentsList = (event) => {
        event.stopPropagation()
        setDocumentsOpened(!documentsOpened)
    }

    const goToNewDocument = (event, title: string) => {

        event.stopPropagation()

        const path = `/documents/${encodeURIComponent(title)}`

        if(path !== window.location.pathname) {
            router.push(
                {
                    pathname: path,
                    query: { 
                        page: 1,
                    }
                },
                undefined,
                { shallow: false }
            )
        }
        setDocumentsOpened(true)

        if(currentDocumentOpen === title) {
            setCurrentDocumentOpen("")
        } else {
            setCurrentDocumentOpen(title)
        }
    }

    const navigateToPage = (event, title, page) => {

        event.stopPropagation()

        const path = `/documents/${encodeURIComponent(title)}`

        router.push(
            {
                pathname: path,
                query: { page: page }
            },
            undefined,
            { shallow: path !== window.location.pathname ? false : true }
        )
    }
    
    const { data, isSuccess } = useGetDocumentsList()

    return (
        <aside className="overflow-y-scroll h-full w-64 rounded fixed m-5">
            <div className="overflow-y-auto py-4 px-3 bg-gray-50 rounded-lg dark:bg-gray-800">
                <ul>
                    <li onClick={() => routerRedirect("/documents/upload-document")}>
                        <div className="cursor-pointer flex items-center p-2 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
                            <HiOutlineCloudUpload size={20} />
                            <h2 className="ml-2">Upload document</h2>
                        </div>
                    </li>
                    <li onClick={(event) => openDocumentsList(event)} >
                        <div className="cursor-pointer w-full flex items-center p-2 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
                            <HiOutlineDocumentDuplicate size={20} />
                            <h2 className="ml-2">Documents</h2>
                            {documentsOpened ? <RiArrowUpSLine className="right-4 absolute" /> : <RiArrowDownSLine className="right-4 absolute" />}
                        </div>
                        {documentsOpened && (
                            <ul className="pl-4 list-inside">
                                {isSuccess && data.map((document) => (
                                    <li key={document.title} onClick={(event) => goToNewDocument(event, document.title)}>
                                        <div className="cursor-pointer w-full flex items-center p-2 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
                                            <h2 className="text-sm mr-2 ml-2">
                                                {document.title}
                                            </h2>
                                            {currentDocumentOpen === document.title ? <RiArrowUpSLine className="right-4 absolute" /> : <RiArrowDownSLine className="right-4 absolute" />}
                                        </div>
                                        {currentDocumentOpen === document.title && document.content.map((content) => (
                                            <ul className="pl-4 list-inside">
                                                <li key={content.page} onClick={(event) => navigateToPage(event, document.title, content.page)}>
                                                    <div className="cursor-pointer w-full flex items-center p-2 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
                                                        <RiPagesLine />
                                                        <h2 className="text-sm mr-2 ml-2">{`Page ${content.page}`}</h2>
                                                    </div>
                                                </li>
                                            </ul>
                                        ))}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                </ul>
            </div>
        </aside>
    )
}

export default SideNavBar