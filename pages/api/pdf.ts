import { getSession } from "next-auth/react";
import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  const vision = require('@google-cloud/vision');

  const client = new vision.ImageAnnotatorClient({
    keyFilename: "/Users/rasmuslind/Desktop/theta-totem-362717-ab82f004ec37.json"
  });

  const session = await getSession({ req })

  const {Storage} = require('@google-cloud/storage');

  const storage = new Storage({
      keyFilename: "/Users/rasmuslind/Desktop/theta-totem-362717-ab82f004ec37.json"
  });

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

    console.log(destinationUri)

    const bucket = storage.bucket(bucketName)

    const [files] = await bucket.getFiles({ prefix: `${session.user.email}/${req.body.folderName}` });
  
    const srcFilename = files[0].name;

    let pdfData = await bucket.file(srcFilename).createReadStream()
    let data = '';

    pdfData.on('data', (res) => {
      data += res;
    }).on('end', async () => {
      await prisma.document.update({
        where: {
          title: fileName
        },
        data: {
          draft: false,
          content: {
            createMany: {
              data: 
                JSON.parse(data).responses.map((response, index) => (
                {                  
                  page: index + 1,
                  text: response.fullTextAnnotation.text,
                }
                )) 
                     
            }
          }
        },
        select: {
          content: true
        }
      })
    }); 

    console.log(fileName)


    res.status(200).json({message: "success"})

  } catch(error) {
    res.status(500).json({message: "error processing the file"})
    throw error
  }
}