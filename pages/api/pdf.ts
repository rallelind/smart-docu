import path from 'path'

export default async function handler(req, res) {
  const vision = require('@google-cloud/vision');

  // Creates a client
  const client = new vision.ImageAnnotatorClient({
    keyFilename: "/Users/rasmuslind/Desktop/theta-totem-362717-ab82f004ec37.json"
  });

  // Performs label detection on the image file
  try {

    // Creates a client
    
    /**
     * TODO(developer): Uncomment the following lines before running the sample.
     * gs://pdf-storage-smart-docu/Inklusionens-pædagogik1.pdf
     */
    // Bucket where the file resides
    const bucketName = 'pdf-storage-smart-docu';
    // Path to PDF file within bucket
    const fileName = 'CV - Toucans.pdf';
    // The folder to store the results
    const outputPrefix = 'testing'
    
    const gcsSourceUri = `gs://${bucketName}/${fileName}`;
    const gcsDestinationUri = `gs://${bucketName}/${outputPrefix}/`;
    
    const inputConfig = {
      // Supported mime_types are: 'application/pdf' and 'image/tiff'
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