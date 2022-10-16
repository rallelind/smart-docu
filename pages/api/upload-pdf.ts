
import { Prisma } from '@prisma/client';
import { getSession } from 'next-auth/react';
import { generateDocumentQuery } from '../../lib/queries/document-queries';
import { googleCloudStorageClient } from '../../lib/google-cloud-platform/clients';

export default async function handler(req, res) {
    
    const bucketName = 'pdf-storage-smart-docu';

    const bucket = googleCloudStorageClient.bucket(bucketName);

    const responseHeader = 'Content-Type';

    const origin = process.env.ENVIRONMENT;

    const method = 'POST'

    const maxAgeSeconds = Date.now() + 1 * 60 * 1000

    await bucket.setCorsConfiguration([
        {
            method: [method],
            origin: [origin],
            responseHeader: [responseHeader],
        },
    ])

    const session = await getSession({ req })

    const file = bucket.file(`${session.user.email}/${req.query.file}`);

    const options = {
      expires: maxAgeSeconds, //  1 minute,
      fields: { 'x-goog-meta-test': 'data' },
    };

    const [response] = await file.generateSignedPostPolicyV4(options);

    const email = session.user.email;
    const title = req.query.file;
    const pdfLink = `${response.url}${response.fields.key}`;

      try {
        await generateDocumentQuery(email, title, pdfLink)
        res.status(200).json(response);
      } catch(error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            res.status(400).json({ error: "a file with that name already exists" })
          }
        }
        throw error
      }
}
