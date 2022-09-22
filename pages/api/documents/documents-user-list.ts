import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";

export default async function(req, res) {

    const session = await getSession({ req })

    try {
        const documentsUserList = await prisma.document.findMany({
            where: {
                author: { email: session.user.email },
                draft: false
            },
            select: {
                title: true,
                content: {
                    select: {
                        page: true,
                    }
                }
            }
        })
        res.status(200).json(documentsUserList)
    } catch(error) {
        res.status(500).json({message: "server error"})
    }
}