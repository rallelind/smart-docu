import path from 'path'

export default async function handler(req, res) {
    const {Storage} = require('@google-cloud/storage');
    const storage = new Storage({
        keyFilename: "/Users/rasmuslind/Desktop/theta-totem-362717-ab82f004ec37.json"
    });

    const gcsSourceUri = `pdf-storage-smart-docu`;

    const srcFilename = "results/output-1-to-10.json";

    const destFilename = path.join(process.cwd(), 'public');

    const options = {
        destination: destFilename,
    };

    var archivo = await storage.bucket(gcsSourceUri).file(srcFilename).createReadStream()
    console.log('Concat Data');
    let data = '';
    archivo.on('data', (res) => {
      data += res;
    }).on('end', function() {
      let formattedData = JSON.parse(data).responses.map((response, index) => {
            const data = {
                page: index + 1,
                text: response.fullTextAnnotation.text,
            }
            return data
      })
      console.log(formattedData)
      res.json(formattedData);
    }); 

}