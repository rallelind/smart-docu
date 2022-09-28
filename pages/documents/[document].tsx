import { useState, useRef } from "react";
import useClickOutside from "../../lib/custom-hooks/useClickOutside";

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

export default function Documents({ document }) {

  const [commentSectionActive, setCommentSectionActive] = useState(false);
  const [commentingActive, setCommentingActive] = useState(false)
  const [selectedColor, setSelectedColor] = useState("#fde047");
  const [selectionOptionsOpen, setSelectionOptionsOpen] = useState(false)

  const floatingMenuRef = useRef()

  console.log(selectionOptionsOpen)

  useClickOutside(floatingMenuRef, () => {
        if(selectionOptionsOpen && floatingMenuRef.current !== undefined) {
            setSelectionOptionsOpen(false)
        } 
    })

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
            onSelectionChange={setSelectionOptionsOpen}
        >
            {selectionOptionsOpen && (
                <div ref={floatingMenuRef}>
                    <FloatingTextOptionsMenu
                        commentingActive={activeCommenting}
                        selectedColor={selectedColor}
                        onColorChange={setSelectedColor}
                        onSelectionChange={setSelectionOptionsOpen}
                    />
                </div>
            )}
        </Document>
      </main>
      <RightNotesNavbar
        openCommentSection={setCommentSectionActive}
        open={commentSectionActive}
      >
        <CreateNote commentingActive={commentingActive} color={selectedColor} />
      </RightNotesNavbar>
    </div>
  );
}
