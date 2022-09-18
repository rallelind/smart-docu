import { HiDocumentDuplicate } from "react-icons/hi"
import { RiArrowDownSLine } from "react-icons/ri"
import { TbFileUpload } from "react-icons/tb"
import { useRouter } from "next/router"
import { IoDocumentsOutline } from "react-icons/io5"

const SideNavBar = () => {

    const router = useRouter()

    const routerRedirect = (path: string) => {
        router.push(
            {pathname: path},
            undefined,
            { shallow: true }
        )
    }

    return (
        <aside className="w-64 rounded fixed items-start m-5">
            <div className="overflow-y-auto py-4 px-3 bg-gray-50 rounded dark:bg-gray-800">
                <ul>
                    <li onClick={() => routerRedirect("/documents/upload-document")}>
                        <div className="cursor-pointer flex items-center p-2 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                            <TbFileUpload size={20} />
                            <h2 className="ml-2">Upload document</h2>
                        </div>
                    </li>
                    <li onClick={() => routerRedirect("/documents/document")}>
                        <div className="cursor-pointer w-full flex items-center p-2 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                            <IoDocumentsOutline size={20} />
                            <h2 className="ml-2">Documents</h2>
                            <RiArrowDownSLine className="right-4 absolute" />
                        </div>
                    </li>
                </ul>
            </div>
        </aside>
    )
}

export default SideNavBar