import prisma from "../../../../lib/prisma";

export default async function(req, res) {

    const documentTitle = req.query.title

    const { 
        highlightStartOffset,
        highlightEndOffset,
        highlightStartContainer,
        highlightEndContainer,
    } = req.body

    console.log(highlightEndContainer)

    try {

        let userHighlightData = await prisma.document.update({
            where: { title: documentTitle },
            data: {
                userAnnotation: {
                    create: {
                        highlightStartOffset,
                        highlightEndOffset,
                        highlightStartContainer,
                        highlightEndContainer,
                    }
                }
            }            
        })

        res.json(userHighlightData)

    } catch(error) {
        throw error
    }
}