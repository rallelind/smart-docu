import SideNavBar from "../../components/layout/SideNavBar"
import UploadFile from "../../components/UploadFile"
import prisma from "../../lib/prisma";
import { getSession } from "next-auth/react";

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

export default function UploadDocument({ drafts }) {

    console.log(drafts)

    return (
        <div className="flex">
            <div className="flex-initial w-64">
                <SideNavBar />
            </div>
            <div className="flex justify-center w-full">
                <UploadFile drafts={() => drafts.map((draft) => draft.pdfLink)} />
            </div>
        </div>
    )
}