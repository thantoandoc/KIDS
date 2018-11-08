
const uploadVideoToStorage = (file, bucket) => {
    let prom = new Promise((resolve, reject) => {
        if (!file) {
            reject('No Video file');
        }
        let newFileName = `${Date.now()}_${file.originalname}`;
        let fileUpload = bucket.file(newFileName);
        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype,
            }
        });
        blobStream.on('finish', () => {
            // The public URL can be used to directly access the file via HTTP.
            const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${fileUpload.name}?alt=media`;
            resolve(url);
        });

        blobStream.end(file.buffer);
    });
    return prom;
}

module.exports = {
    uploadVideoToStorage,
}