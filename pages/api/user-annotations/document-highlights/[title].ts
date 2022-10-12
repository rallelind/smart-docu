import prisma from "../../../../lib/prisma";

export default async function(req, res) {

    const documentTitle = req.query.title;

    try {
        const userHighlights = await prisma.document.findMany({
            where: { title: documentTitle },
            select: {
                userAnnotation: true,
            }
        })

        res.json(userHighlights)
        
    } catch(error) {
        throw error
    }
}