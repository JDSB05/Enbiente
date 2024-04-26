const { Readable } = require('stream');


exports.uploadImage = (fileBuffer, publicId, width, height) => {
  const cloudinary = require('cloudinary').v2;
  const { Readable } = require('stream');

  return new Promise((resolve, reject) => {
    try {
      // Configurações para corte com detecção facial
      const transformationOptions = {
        public_id: publicId,
        width: width,
        height: height,
        crop: 'fill', // ou 'thumb' para um corte mais apertado
        gravity: 'faces', // 'face' para a maior face ou 'faces' para todas as faces
        quality: 'auto', // ajusta a qualidade automaticamente
        fetch_format: 'auto' // ajusta o formato do arquivo automaticamente
      };

      const uploadStream = cloudinary.uploader.upload_stream(
        transformationOptions,
        (error, result) => {
          if (error) {
            reject({ success: false, message: `Error while uploading file to Cloudinary: ${JSON.stringify(error)}` });
          } else {
            resolve(result);
          }
        }
      );

      const bufferStream = new Readable();
      bufferStream.push(fileBuffer);
      bufferStream.push(null);

      bufferStream.on('error', (error) => {
        reject({ success: false, message: `Error while creating the buffer stream: ${error}` });
      });

      bufferStream.pipe(uploadStream).on('error', (error) => {
        reject({ success: false, message: `Error while uploading file to Cloudinary: ${error}` });
      });
    } catch (error) {
      reject({ success: false, message: `Error while initializing Cloudinary: ${error}` });
    }
  });
};