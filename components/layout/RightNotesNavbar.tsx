import { useState } from "react"
import { GrFormClose } from "react-icons/gr"

const RightNotesNavbar = ({ openCommentSection, open, children }) => {

    if(!open){
        return (
            <div className="fixed right-4 top-4">
                <button onClick={() => openCommentSection(true)} type="button" className={`text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"}`}>
                    Open comments
                </button>
            </div>
        )
    }

    return (
        <div className="h-full right-0 position fixed border-l-2 bg-gray-50 overflow-y-scroll">
            <div 
                onClick={() => openCommentSection(false)}
                className="cursor-pointer absolute top-2 right-2">
                <GrFormClose size={25} />
            </div>
            <div className="mt-10">
                {children}
            </div>
        </div>
    )
}

export default RightNotesNavbar