
import { Storage } from '@google-cloud/storage';


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



      const file = bucket.file(req.query.file);
      const options = {
        expires: maxAgeSeconds, //  1 minute,
        fields: { 'x-goog-meta-test': 'data' },
        public: true,
      };


    
      const [response] = await file.generateSignedPostPolicyV4(options);
        
      console.log(response)
        res.status(200).json(response);
}
