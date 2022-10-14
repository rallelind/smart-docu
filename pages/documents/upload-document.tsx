import React from "react";
import UploadFile from "../../components/UploadFile"
import ApplicationLayout from "../../components/layout/ApplicationLayout";
import { NextPageWithLayout } from "../_app"

const UploadDocument: NextPageWithLayout = () => {

    return (
        <div className="flex justify-center w-full">
            <UploadFile />
        </div>
    )
}

export default UploadDocument;

UploadDocument.getLayout = function getLayout(page) {
    return (
        <ApplicationLayout>{page}</ApplicationLayout>
    )
  }