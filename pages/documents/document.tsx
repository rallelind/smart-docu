import Document from "../../components/Document";
import SideNavBar from "../../components/layout/SideNavBar";
import prisma from "../../lib/prisma";
import { getSession } from "next-auth/react";

export async function getStaticProps({ req }) {

  const session = await getSession({ req })

  const document = await prisma.document.findMany({
    where: {
      author: { email: session?.user?.email }
    },
    select: {
      content: true
    }
  })

  return {
    props: {
      document,
    },
  }
}

export default function Home({ document }) {

  console.log(document[0].content)

  return (
    <div className="flex">
      <div className="flex-initial w-64">
        <SideNavBar />
      </div>
      <div className="flex justify-center w-full">
        <Document 
            document={document[0].content}
          />
      </div>
    </div>
  )

}
