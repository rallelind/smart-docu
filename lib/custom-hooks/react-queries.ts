import { useQuery } from "react-query";


const fetchDocumentHighligths = async (title: string) => {
    const res = await fetch(`/api/user-annotations/document-highlights/${title}`)
    return res.json()
  }

const fetchNotes = async (title: string) => {
    const res = await fetch(`/api/user-annotations/notes/${title}`)
    return res.json()    
}

const fetchDrafts = async () => {
    const res = await fetch(`/api/documents/drafts`)
    return res.json()
}

const fetchDocumentList = async () => {
    const res = await fetch("/api/documents/documents-user-list")
    return res.json()
}

export const useGetDocumentHighlights = (title: string) => {
    return useQuery(["document-highlights"], () => fetchDocumentHighligths(title))
}

export const useGetDocumentNotes = (title: string) => {
    return useQuery(["document-notes"], () => fetchNotes(title))
}

export const useGetDocumentDrafts = () => {
    return useQuery(["document-drafts"], fetchDrafts)
}

export const useGetDocumentsList = () => {
    return useQuery(["documents-list"], fetchDocumentList)
}