import prisma from "../../../../lib/prisma"
import { createNote } from "../../../../lib/queries/annotation-queries"

export default async function(req, res) {

    const userAnnotationId = req.query.id

    try {
        const createdNote = await createNote(req.body, userAnnotationId)
        res.json(createdNote)
    } catch(error) {
        throw error
    }
}