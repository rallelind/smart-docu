import { getSession } from "next-auth/react";
import prisma from "../../lib/prisma";
import { Storage } from "@google-cloud/storage";
const vision = require('@google-cloud/vision');
import { createDocumentDraftQuery } from "../../lib/queries/document-queries";

const client = new vision.ImageAnnotatorClient({
  projectId: process.env.GOOGLE_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  },
});

const storage = new Storage({
  projectId: process.env.GOOGLE_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  },
});

export default async function handler(req, res) {

  const session = await getSession({ req })

  try {

    const bucketName = 'pdf-storage-smart-docu';

    const fileName = req.body.fileName;

    const outputPrefix = req.body.folderName
    
    const gcsSourceUri = `gs://${bucketName}/${session.user.email}/${fileName}`;
    const gcsDestinationUri = `gs://${bucketName}/${session.user.email}/${outputPrefix}/`;
    
    const inputConfig = {
      mimeType: 'application/pdf',
      gcsSource: {
        uri: gcsSourceUri,
      },
    };

    const outputConfig = {
      gcsDestination: {
        uri: gcsDestinationUri,
      },
    };
    
    const features = [{type: 'DOCUMENT_TEXT_DETECTION'}];
    const request = {
      requests: [
        {
          inputConfig: inputConfig,
          features: features,
          outputConfig: outputConfig,
        },
      ],
    };
    
    const [operation] = await client.asyncBatchAnnotateFiles(request);

    const [filesResponse] = await operation.promise();

    const destinationUri = filesResponse.responses[0].outputConfig.gcsDestination.uri;

    const bucket = storage.bucket(bucketName)

    const [files] = await bucket.getFiles({ prefix: `${session.user.email}/${req.body.folderName}` });
  
    const srcFilename = files[0].name;

    let pdfData = bucket.file(srcFilename).createReadStream()
    let data = '';

    pdfData.on('data', (res) => {
      data += res;
    }).on('end', async () => {
      await createDocumentDraftQuery(fileName, data)
      .then(() => {
        res.status(200).json({message: "success"})
      })
      .catch(() => {
        res.status(404).json({message: "error"})
      })
      
    }); 


  } catch(error) {
    res.status(500).json({message: "error processing the file"})
    throw error
  }
}