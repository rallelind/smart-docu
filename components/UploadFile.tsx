import React, { useState, useEffect } from "react"
import { BiCheckbox, BiCheckboxChecked } from "react-icons/bi"
import ToastLoader from "./toasters/ToastLoader";
import ToastSuccess from "./toasters/ToastSuccess";
import ToastError from "./toasters/ToastError";

const UploadFile = ({ drafts }) => {

    const [uploadedFileUrls, setUploadedFileUrls] = useState(drafts)
    const [pickedFile, setPickedFile] = useState("")
    const [toaster, setToaster] = useState(<></>)

    const changeHandler = async (event) => {
        
        setToaster(<ToastLoader onClose={() => setToaster(<></>)} />)

        const file = event.target.files[0];
        const filename = encodeURIComponent(file.name);
        const res = await fetch(`/api/upload-pdf?file=${filename}`);
        const { url, fields } = await res.json();
        const formData = new FormData();

        Object.entries({ ...fields, file }).forEach(([key, value]) => {
          formData.append(key, value as string);
        });
    
        const upload = await fetch(url, {
          method: 'POST',
          body: formData,
        });

    
        if (upload.ok) {
            setUploadedFileUrls([...uploadedFileUrls, `${url}${file.name}`])
            setToaster(<ToastSuccess onClose={() => setToaster(<></>)} />)
        } else {
          console.error('Upload failed.');
          setToaster(<ToastError onClose={() => setToaster(<></>)} />)
        }
    };
    
    const pickedFileToGenerateDocument = (url: string) => {
        if(pickedFile.length < 1 || url !== pickedFile) {
            setPickedFile(url);
        } else {
            setPickedFile("");
        };
    };

    const randomId = (): string => {
        const uint32 = window.crypto.getRandomValues(new Uint32Array(1))[0];
        return uint32.toString(16);
      }

    const onSubmitPDFDocument = async () => {

        const { pathname } = new URL(pickedFile);

        const paths = pathname.split("/")

        const fileName = paths[paths.length - 1]

        setToaster(<ToastLoader onClose={() => setToaster(<></>)} />)

        const folderName = randomId()
        

        const body = {
            fileName: decodeURIComponent(fileName),
            folderName: folderName,
        }

        console.log(fileName)

        try {
            await fetch("/api/pdf", {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify(body)
            })
        } catch(error) {
            setToaster(<ToastError onClose={() => setToaster(<></>)} />)
        } 
    }


    return (
        <div className="w-[75%]">
            <div className="w-full mt-5">
                <label
                    className="flex justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-lg appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                    <span className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span className="font-medium text-gray-600">
                            Drop files to Attach, or click to browse files
                        </span>
                    </span>
                    <input onChange={changeHandler} type="file" accept="application/pdf" name="file_upload" className="hidden" />
                </label>
            </div>
            <p className="font-medium text-gray-600 mt-10">
                Please pick a PDF file you want to upload. After picking a file the uploading
                and building of the new document from the pdf may take some time, so please have patience. 
                Afterwards, navigate to documents in the side bar to see your uploaded documents.
            </p>
            <div className="mt-10">
                <ul>
                    {uploadedFileUrls.map((uploadedFileUrl) => (
                        <li 
                            onClick={() => pickedFileToGenerateDocument(uploadedFileUrl)}
                            className={`cursor-pointer flex items-center mt-5 p-2 rounded-lg ${uploadedFileUrl === pickedFile ? "bg-green-200" : "bg-gray-50"} ${uploadedFileUrl !== pickedFile && "hover:bg-gray-100"}`}>
                            <p className={`w-full font-medium ${uploadedFileUrl === pickedFile ? "text-black" : "text-gray-600"} underline`}>{uploadedFileUrl}</p>
                            {uploadedFileUrl === pickedFile ? <BiCheckboxChecked size={30} /> : <BiCheckbox size={30} />}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mt-10 flex justify-center">
                {uploadedFileUrls.length > 0 && <button onClick={onSubmitPDFDocument} type="button" className={`text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 ${pickedFile.length < 1 && "cursor-not-allowed"}`}>{pickedFile.length > 1 ? "Generate document" : "Pick a pdf file"}</button>}
                <div className="fixed bottom-0">
                    {toaster}
                </div>
            </div>
        </div>
    )
}

export default UploadFile