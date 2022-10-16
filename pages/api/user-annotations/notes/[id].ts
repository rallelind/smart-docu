import { allNotesQuery } from "../../../../lib/queries/annotation-queries";

export default async function(req, res) {

    const documentId = req.query.id

    try {
        const notes = await allNotesQuery(documentId)

        res.json(notes)
    } catch(error) {
        throw error
    }
}