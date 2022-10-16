import prisma from "../prisma";
import { TextAnnotaionResponse } from "./qyery-interfaces";

export const documentsUserListQuery = async (userEmail: string) => {
    return await prisma.document.findMany({
        where: {
            author: { email: userEmail },
            draft: false
        },
        select: {
            title: true,
            content: {
                select: {
                    page: true,
                }
            }
        }
    })
}

export const documentDraftsQuery = async (userEmail: string) => {
    return await prisma.document.findMany({
        select: {
            pdfLink: true,
        },
        where: {
            author: {
                email: userEmail
            },
            draft: true
        }
    })
}

export const createDocumentDraftQuery = async (fileName: string, data: string) => {
    return await prisma.document.update({
        where: {
          title: fileName
        },
        data: {
          draft: false,
          content: {
            createMany: {
              data: 
                JSON.parse(data).responses.map((response: TextAnnotaionResponse, index: number) => (
                {                  
                  page: index + 1,
                  text: response.fullTextAnnotation.text,
                }
                )) 
                     
            }
          }
        },
        select: {
          content: true
        }
      }) 
}

export const generateDocumentQuery = async (email: string, title: string, pdfLink: string) => {
    return await prisma.document.create({
        data: {
          author: { connect: { email } },
          title,
          pdfLink,
        }
      })
}

export const allDocumentTitlesQuery = async (email: string) => {
    return await prisma.document.findMany({
        where: {
          author: { email },
        },
        select: {
          title: true,
        },
      });
}

export const currentDocumentQuery = async (title: string) => {
    return await prisma.document.findUnique({
        where: {
          title,
        },
        include: {
          content: true,
        },
      });
}