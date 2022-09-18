import React, { useState } from "react"

const UploadFile = () => {

    const [isFilePicked, setIsFilePicked] = useState(false);
    const [uploadedFileUrl, setUploadedFileUrl] = useState("")

    const changeHandler = async (event) => {
        const file = event.target.files[0];
        const filename = encodeURIComponent(file.name);
        const res = await fetch(`/api/upload-pdf?file=${filename}`);
        const { url, fields } = await res.json();
        const formData = new FormData();
    
        Object.entries({ ...fields, file }).forEach(([key, value]) => {
          formData.append(key, value as any);
        });
    
        const upload = await fetch(url, {
          method: 'POST',
          body: formData,
        });
    
        if (upload.ok) {
            setIsFilePicked(true)
            setUploadedFileUrl(`${url}${file.name}`)
        } else {
          console.error('Upload failed.');
        }
    };

    const onSubmitPDFDocument = async () => {

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
            <p>
                {uploadedFileUrl}
            </p>
            <div className="mt-10 flex justify-center">
                <button onClick={onSubmitPDFDocument} disabled={!isFilePicked} type="button" className={`text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 ${!isFilePicked && "cursor-not-allowed"}`}>{isFilePicked ? "Generate document" : "Pick a pdf file"}</button>
            </div>
        </div>
    )
}

export default UploadFile