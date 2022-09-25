import Document from "../../components/Document";
import SideNavBar from "../../components/layout/SideNavBar";
import RightNotesNavbar from "../../components/layout/RightNotesNavbar";
import prisma from "../../lib/prisma";
import { getSession } from "next-auth/react";

export const getStaticProps = async ({ params }) => {

    const document = await prisma.document.findUnique({
        where: {
            title: String(params?.document),
        },
        include: {
            content: true
        }
    })

    return { props: { document } }
}

export const getStaticPaths = async ({ req }) => {

    const session = await getSession({ req })

    const documents = await prisma.document.findMany({
        where: {
            author: { email: session?.user?.email }
        },
        select: {
            title: true
        }
    })

    const documentTitles = documents.map(document => document.title);

    const paths = documentTitles.map(document => ({params: {document: document.toString()}}))
    
    return {
        paths,
        fallback: false,
    }
}

export default function Documents({ document }) {

  return (
    <div className="flex flex-row">
      <SideNavBar />
      <main className="flex flex-grow w-full">
        <Document 
            generatedDocument={document.content}
          />
      </main>
      <RightNotesNavbar />
    </div>
  )

}