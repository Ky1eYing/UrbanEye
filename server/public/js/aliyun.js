const client = new OSS({
    accessKeyId: 'LTAI5t7BjGAEmanrRyk1h7M6',
    accessKeySecret: 'R8jVymAxExnns8xFXLa03za25Sbgvx',
    region: 'oss-us-east-1',
    bucket: 'urban-eye'
  });

  
function  uploadFile(file, folder) {
    // Set the folder path
    const folderPath = folder ? `${folder}/` : '';
    // Get the file name
    const fileName = file.name;
    // Generate a unique file name
    const uniqueFileName = `${folderPath}${Date.now()}-${fileName}`;
    
    // Use the Aliyun OSS to upload the file
    return client.put(uniqueFileName, file)
      .then(result => {
        console.log('Upload file Success:', result);
        return result.url;
      })
      .catch(err => {
        console.error('Upload file failed:', err)
      });
  }