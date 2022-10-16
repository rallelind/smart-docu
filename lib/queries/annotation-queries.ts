import prisma from "../prisma";
import { 
    NoteData, 
    HighlightData 
} from "./qyery-interfaces";

export const createNote = async (noteData: NoteData, id: string) => {

    const { text, dateOfPost, page } = noteData

    return await prisma.userAnnotation.update({
        where: { id },
        data: {
            notes: {
                create: {
                    text,
                    dateOfPost,
                    page
                }
            }
        }
    })
}

export const allHighLightsQuery = async (documentTitle: string) => {
    return await prisma.document.findMany({
        where: { title: documentTitle },
        select: {
            userAnnotation: true,
        }
    })
}

export const createHighlightQuery = async (highlightData: HighlightData, documentTitle: string) => {
    const { 
        highlightStartOffset,
        highlightEndOffset,
        highlightTextContent,
        highlightNodeHtml,
        highlightTagName,
        color,
        top,
        left
    } = highlightData;

    return await prisma.document.update({
        where: { title: documentTitle },
        data: {
            userAnnotation: {
                create: {
                    highlightStartOffset,
                    highlightEndOffset,
                    highlightTextContent,
                    highlightNodeHtml,
                    highlightTagName,
                    color,
                    top,
                    left
                }
            }
        }            
    })
}

export const allNotesQuery = async (documentId: string) => {
    return prisma.userAnnotation.findMany({
        where: { documentId: documentId },
        select: {
            color: true,
            notes: true
        }
    })
}