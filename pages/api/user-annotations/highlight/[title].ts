import prisma from "../../../../lib/prisma";
import { createHighlightQuery } from "../../../../lib/queries/annotation-queries";

export default async function(req, res) {

    const documentTitle = req.query.title

    try {

        let userHighlightData = await createHighlightQuery(req.body, documentTitle)

        res.json(userHighlightData)

    } catch(error) {
        throw error
    }
}