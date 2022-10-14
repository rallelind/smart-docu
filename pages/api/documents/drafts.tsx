import { getSession } from "next-auth/react"
import prisma from "../../../lib/prisma"

export default async function(req, res) {
    try {
        const session = await getSession({ req })

        const drafts = await prisma.document.findMany({
            select: {
                pdfLink: true,
            },
            where: {
                author: {
                    email: session.user.email
                },
                draft: true
            }
        })
        res.json(drafts)
    } catch(error) {
        throw error
    }
}