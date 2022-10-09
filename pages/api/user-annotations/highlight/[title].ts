import prisma from "../../../../lib/prisma";

export default async function(req, res) {

    const documentTitle = req.query.title

    const { 
        highlightStartOffset,
        highlightEndOffset,
        highlightTextContent,
        highlightNodeHtml,
        highlightTagName,
        color
    } = req.body

    try {

        let userHighlightData = await prisma.document.update({
            where: { title: documentTitle },
            data: {
                userAnnotation: {
                    create: {
                        highlightStartOffset,
                        highlightEndOffset,
                        highlightTextContent,
                        highlightNodeHtml,
                        highlightTagName,
                        color,
                    }
                }
            }            
        })

        res.json(userHighlightData)

    } catch(error) {
        throw error
    }
}