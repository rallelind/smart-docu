import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  const vision = require('@google-cloud/vision');

  const client = new vision.ImageAnnotatorClient({
    keyFilename: "/Users/rasmuslind/Desktop/theta-totem-362717-ab82f004ec37.json"
  });

  try {

    const bucketName = 'pdf-storage-smart-docu';

    console.log(req.body.fileName)

    const fileName: string = req.body.fileName;

    

    const outputPrefix = req.body.folderName
    
    const gcsSourceUri = `gs://${bucketName}/${fileName}`;
    const gcsDestinationUri = `gs://${bucketName}/${outputPrefix}/`;
    
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

    const features = [{type: 'TEXT_DETECTION'}];
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

    res.status(200).json({message: `Json saved to: ${destinationUri}`})

  } catch(error) {
    res.status(500).json({message: "error processing the file"})
    throw error
  }
}