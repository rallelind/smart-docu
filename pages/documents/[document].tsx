import Document from "../../components/Document";
import SideNavBar from "../../components/layout/SideNavBar";
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
    <div className="flex">
      <div className="flex-initial w-64">
        <SideNavBar />
      </div>
      <div className="flex justify-center w-full">
        <Document 
            generatedDocument={document.content}
          />
      </div>
    </div>
  )

}