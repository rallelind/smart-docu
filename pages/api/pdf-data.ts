
export default async function handler(req, res) {

    const {Storage} = require('@google-cloud/storage');

    const storage = new Storage({
        keyFilename: "/Users/rasmuslind/Desktop/theta-totem-362717-ab82f004ec37.json"
    });

    const gcsSourceUri = `pdf-storage-smart-docu`;

    const srcFilename = "results/output-1-to-10.json";


    let pdfData = await storage.bucket(gcsSourceUri).file(srcFilename).createReadStream()
    let data = '';
    pdfData.on('data', (res) => {
      data += res;
    }).on('end', function() {
      let formattedData = JSON.parse(data).responses.map((response, index) => {
            const data = {
                page: index + 1,
                text: response.fullTextAnnotation.text,
            }
            return data
      })
      res.json(formattedData);
    }); 

}