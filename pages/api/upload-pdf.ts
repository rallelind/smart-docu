
import { Storage } from '@google-cloud/storage';
import { Prisma } from '@prisma/client';
import prisma from '../../lib/prisma';
import { getSession } from 'next-auth/react';


export default async function handler(req, res) {
    
    const storage = new Storage({
        keyFilename: "/Users/rasmuslind/Desktop/theta-totem-362717-ab82f004ec37.json"
    });
    
    const bucketName = 'pdf-storage-smart-docu';

    const bucket = storage.bucket(bucketName);

    const responseHeader = 'Content-Type';

    const origin = "http://localhost:3000";

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

    try {
      await prisma.document.create({
        data: {
          author: { connect: { email: session.user.email } },
          title: req.query.file,
          pdfLink: `${response.url}${response.fields.key}`,
        }
      })
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
