import { useState, useEffect } from "react";

import Document from "../../components/Document";
import SideNavBar from "../../components/layout/SideNavBar";
import RightNotesNavbar from "../../components/layout/RightNotesNavbar";
import CreateNote from "../../components/CreateNote";
import FloatingTextOptionsMenu from "../../components/FloatingTextOptionsMenu";
import colorOptions from "../../lib/color-data/color-options";
import ColorItem from "../../components/ColorItem";
import Note from "../../components/Note";

import prisma from "../../lib/prisma";
import { getSession } from "next-auth/react";
import { useQuery } from "react-query"
import { useRouter } from "next/router";

export const getStaticProps = async ({ params }) => {
  const generatedDocument = await prisma.document.findUnique({
    where: {
      title: String(params?.document),
    },
    include: {
      content: true,
    },
  });

  return { props: { generatedDocument } };
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
    generatedDocument: {
        title: string
        content: [{
            page: number,
            text: string,
        }];
    };
}

const Documents: React.FC<Document> = ({ generatedDocument }) => {

  const [commentSectionActive, setCommentSectionActive] = useState<boolean>(false);
  const [commentingActive, setCommentingActive] = useState<boolean>(false)
  const [selectedColor, setSelectedColor] = useState<string>("#fde047");
  const [selectionOptionsOpen, setSelectionOptionsOpen] = useState<boolean>(false)
  const [floatingMenuPlacement, setFloatingMenuPlacement] = useState<{ top: number, left: number }>({
    top: 0,
    left: 0,
  })
  const [activeAnnotationId, setActiveAnnotationId] = useState<string>()

    const activeCommenting = () => {
        setCommentSectionActive(true)
        if(commentSectionActive) {
          setCommentingActive(!commentingActive)
        } else {
          setCommentingActive(true)
        }
    }

    const fetchDocumentHighligths = async () => {
      const res = await fetch(`/api/user-annotations/document-highlights/${generatedDocument.title}`)
      return res.json()
    }

    const fetchNotes = async () => {
      const res = await fetch(`/api/user-annotations/notes/${generatedDocument.title}`)
      return res.json()    
    }
  
    const { 
      data: highlights, 
      isSuccess: highlightLoadSuccess, 
      isLoading: highlightLoading, 
      refetch: refetchHighlights 
    } = useQuery("document-highlights", fetchDocumentHighligths)

    const { 
      data: notes, 
      isSuccess: notesSuccessLoad, 
      isLoading: notesLoading, 
      refetch: refetchNotes 
    } = useQuery("document-notes", fetchNotes)

    const findNode = (annotation): any | ChildNode => {
      let documentContent = document.getElementById('document');
      let tagList = documentContent.getElementsByTagName(annotation.highlightTagName);

      const foundElement = Array.from(tagList).find((tag) => tag.innerHTML == annotation.highlightNodeHtml)
      if (typeof foundElement !== "undefined") {
        const foundNode = Array.from(foundElement.childNodes).find((childNode: ChildNode) => (
          childNode.textContent === annotation.highlightTextContent)
        )
        return foundNode
      }
      return
    }

    const highlightOnClick = (annotation) => {
      const { top, left, color, id } = annotation

      setSelectionOptionsOpen(!selectionOptionsOpen)
      setFloatingMenuPlacement({top, left})
      setSelectedColor(color)
      setActiveAnnotationId(id)
    }

    const renderHighlight = () => {
      !highlightLoading && highlightLoadSuccess && highlights.map((userAnnotations) => (
        userAnnotations.userAnnotation.map((annotation) => {

          const foundNode = findNode(annotation)

          let element = document.createElement("span");
          element.style.backgroundColor = annotation.color
          element.classList.add("select-none", "cursor-pointer")
          element.onclick = () => highlightOnClick(annotation)


          if(typeof foundNode !== "undefined") {
            const userAnnotationRange = document.createRange()

            userAnnotationRange.setStart(foundNode, annotation.highlightStartOffset)
            userAnnotationRange.setEnd(foundNode, annotation.highlightEndOffset)
            userAnnotationRange.surroundContents(element);
          
          }

        })
      ))
    }

    const router = useRouter()
    
    useEffect(() => {
      renderHighlight()
    }, [renderHighlight])

    useEffect(() => {
      refetchHighlights()
      renderHighlight()
    }, [router.query.page])

    const setColor = (event, color: string) => {
      event.preventDefault()
      setSelectedColor(color)
    }

    const { top, left } = floatingMenuPlacement

    const floatingMenuData = {
      selectedColor,
      selectionOptionsOpen,
      documentTitle: generatedDocument.title,
      topPlacement: top,
      leftPlacement: left
    }

  return (
    <div className="flex flex-row">
      <SideNavBar />
      <main className="flex flex-grow w-full">
        <Document generatedDocument={generatedDocument.content}>
            <FloatingTextOptionsMenu
                commentingActive={activeCommenting}
                openSelectionMenu={setSelectionOptionsOpen}
                floatingOptionPlacement={setFloatingMenuPlacement}
                floatingMenuData={floatingMenuData}
            >
                {colorOptions.map((colorOption, index) => (
                  <ColorItem 
                      key={index}
                      onMouseDown={(event) => setColor(event, colorOption)} 
                      color={colorOption} 
                    />
                ))}
            </FloatingTextOptionsMenu>
        </Document>
      </main>
      <RightNotesNavbar
        openCommentSection={setCommentSectionActive}
        open={commentSectionActive}
      >
        {commentingActive && (
          <CreateNote 
              onNoteCreate={refetchNotes}
              annotationId={activeAnnotationId}
          />
        )}
        {notesSuccessLoad && notes.map((note) => (
          note.notes.length > 0 && note.notes.map((noteData) => <Note note={noteData} color={note.color} />)
        ))}
      </RightNotesNavbar>
    </div>
  );
}

export default Documents;
