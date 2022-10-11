import prisma from "../../../../lib/prisma"

export default async function(req, res) {

    const userAnnotationId = req.query.id

    const {
        text,
        dateOfPost,
        page
    } = req.body

    try {
        const createNote = await prisma.userAnnotation.update({
            where: { id: userAnnotationId },
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
        res.json(createNote)
    } catch(error) {
        throw error
    }
}