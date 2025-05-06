const client = new OSS({
    accessKeyId: 'LTAI5tFHofvKn5NCYATVuqHA',
    accessKeySecret: 'hHKHe4abvekRLB89ia7bytaw8yZb1w',
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