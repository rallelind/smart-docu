import { getSession } from "next-auth/react"
import { documentDraftsQuery } from "../../../lib/queries/document-queries"

export default async function(req, res) {
    try {
        const session = await getSession({ req })

        const drafts = await documentDraftsQuery(session.user.email)

        res.json(drafts)
    } catch(error) {
        throw error
    }
}