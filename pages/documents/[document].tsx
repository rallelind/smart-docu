import { useState, useRef } from "react";

import Document from "../../components/Document";
import SideNavBar from "../../components/layout/SideNavBar";
import RightNotesNavbar from "../../components/layout/RightNotesNavbar";
import CreateNote from "../../components/CreateNote";
import FloatingTextOptionsMenu from "../../components/FloatingTextOptionsMenu";

import prisma from "../../lib/prisma";
import { getSession } from "next-auth/react";

export const getStaticProps = async ({ params }) => {
  const document = await prisma.document.findUnique({
    where: {
      title: String(params?.document),
    },
    include: {
      content: true,
    },
  });

  return { props: { document } };
};

export const getStaticPaths = async ({ req }) => {
  const session = await getSession({ req });

  const documents = await prisma.document.findMany({
    where: {
      author: { email: session?.user?.email },
    },
    select: {
      title: true,
    },
  });

  const documentTitles = documents.map((document) => document.title);

  const paths = documentTitles.map((document) => ({
    params: { document: document.toString() },
  }));

  return {
    paths,
    fallback: false,
  };
};

interface Document {
    document: {
        title: string
        content: [{
            page: number,
            text: string,
        }];
    };
}

const Documents: React.FC<Document> = ({ document }) => {

  const [commentSectionActive, setCommentSectionActive] = useState(false);
  const [commentingActive, setCommentingActive] = useState(false)
  const [selectedColor, setSelectedColor] = useState("#fde047");

    const activeCommenting = () => {
        setCommentSectionActive(true)
        setCommentingActive(true)
    }

  return (
    <div className="flex flex-row">
      <SideNavBar />
      <main className="flex flex-grow w-full">
        <Document 
          generatedDocument={document.content}
          documentTitle={document.title}
        >
            <FloatingTextOptionsMenu
                commentingActive={activeCommenting}
                selectedColor={selectedColor}
                onColorChange={setSelectedColor}
                documentTitle={document.title}
            />
        </Document>
      </main>
      <RightNotesNavbar
        openCommentSection={setCommentSectionActive}
        open={commentSectionActive}
      >
        <CreateNote 
            commentingActive={commentingActive} 
            color={selectedColor} 
        />
      </RightNotesNavbar>
    </div>
  );
}

export default Documents;
