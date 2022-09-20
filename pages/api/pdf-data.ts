

export default async function handler(req, res) {

      const {Storage} = require('@google-cloud/storage');

      const storage = new Storage({
          keyFilename: "/Users/rasmuslind/Desktop/theta-totem-362717-ab82f004ec37.json"
      });

      const gcsSourceUri = `pdf-storage-smart-docu`;

      const bucket = storage.bucket(gcsSourceUri)

      const [files] = await bucket.getFiles({ prefix: req.body.folderName });

      const srcFilename = files[0].name;

    try {

      let pdfData = await bucket.file(srcFilename).createReadStream()
      let data = '';
      let formattedData;

      pdfData.on('data', (res) => {
        data += res;
      }).on('end', function() {
        formattedData = JSON.parse(data).responses.map((response, index) => {
              const data = {
                  page: index + 1,
                  text: response.fullTextAnnotation.text,
              }
              return data
        })
        res.json(formattedData)
      }); 

    } catch(error) {
      throw error
    }
}