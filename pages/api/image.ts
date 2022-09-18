// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import path from 'path'

export default async function handler(req, res) {
  const vision = require('@google-cloud/vision');

  // Creates a client
  const client = new vision.ImageAnnotatorClient({
    keyFilename: "/Users/rasmuslind/Desktop/theta-totem-362717-ab82f004ec37.json"
  });

  // Performs label detection on the image file
  try {
  const [result] = await client.textDetection(path.join(process.cwd(), 'public/test.png'));
  res.json(result.fullTextAnnotation.text)
  } catch(error) {
    res.json({message: "error"})
  }
}
