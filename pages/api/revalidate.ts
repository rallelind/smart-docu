import { NextApiRequest, NextApiResponse } from "next"

export default async function (req: NextApiRequest, res: NextApiResponse) {

  let pathToRevalidate = req.query.title

  console.log(pathToRevalidate)
  console.log(req.query.secret)

    if (req.query.secret !== process.env.REVALIDATE_SSR_TOKEN) {
        return res.status(401).json({ message: 'Invalid token' })
    }

    try {
        // this should be the actual path not a rewritten path
        // e.g. for "/blog/[slug]" this should be "/blog/post-1"
        await res.revalidate(`/documents/${pathToRevalidate}`)
        return res.json({ revalidated: true })
      } catch (err) {
        // If there was an error, Next.js will continue
        // to show the last successfully generated page
        console.log(err)
        return res.status(500).send('Error revalidating')
      }

}