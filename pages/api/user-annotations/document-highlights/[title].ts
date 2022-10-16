import { allHighLightsQuery } from "../../../../lib/queries/annotation-queries";

export default async function(req, res) {

    const documentTitle = req.query.title;

    try {
        const userHighlights = await allHighLightsQuery(documentTitle)

        res.json(userHighlights)
        
    } catch(error) {
        throw error
    }
}