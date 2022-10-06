import prisma from "../../../../lib/prisma";

export default async function(req, res) {

    const documentTitle = req.query.title

    const { 
        highlightStartOffset,
        highlightEndOffset,
        highlightedText,
        highlightNodeHtml,
        highlightNodeTagName
    } = req.body

    try {

        let userHighlightData = await prisma.document.update({
            where: { title: documentTitle },
            data: {
                userAnnotation: {
                    create: {
                        highlightStartOffset,
                        highlightEndOffset,
                        highlightedText,
                        highlightNodeHtml,
                        highlightNodeTagName
                    }
                }
            }            
        })

        res.json(userHighlightData)

    } catch(error) {
        throw error
    }
}