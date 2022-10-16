import { getSession } from "next-auth/react";
import { documentsUserListQuery } from "../../../lib/queries/document-queries";

export default async function(req, res) {

    const session = await getSession({ req })

    try {
        const documentsUserList = await documentsUserListQuery(session.user.email);

        res.status(200).json(documentsUserList)
    } catch(error) {
        res.status(500).json({message: "server error"})
    }
}