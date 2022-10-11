import prisma from "../../../../lib/prisma";

export default async function(req, res) {

    const documentId = req.query.id

    try {
        const notes = await prisma.userAnnotation.findMany({
            where: { documentId: documentId },
            select: {
                color: true,
                notes: true
            }
        })
        res.json(notes)
    } catch(error) {
        throw error
    }
}