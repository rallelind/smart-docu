import React from "react";
import SideNavBar from "../../components/navbars/SideNavBar"
import UploadFile from "../../components/UploadFile"
import prisma from "../../lib/prisma";
import { getSession } from "next-auth/react";
import ApplicationLayout from "../../components/layout/ApplicationLayout";

interface UploadDocument {
    drafts: [{
        pdfLink: string,
    }]
}

export async function getServerSideProps({ req }) {

    const session = await getSession({ req })

    const drafts = await prisma.document.findMany({
        select: {
            pdfLink: true,
        },
        where: {
            author: {
                email: session.user.email
            },
            draft: true
        }
    })
  
    return {
      props: {
        drafts,
      },
    }
  }

const UploadDocument: React.FC<UploadDocument> = ({ drafts }) => {

    return (
        <div className="flex justify-center w-full">
            <UploadFile drafts={() => drafts.map((draft) => draft.pdfLink)} />
        </div>
    )
}

export default UploadDocument;

UploadDocument.getLayout = function getLayout(page) {
    return (
        <ApplicationLayout>{page}</ApplicationLayout>
    )
  }