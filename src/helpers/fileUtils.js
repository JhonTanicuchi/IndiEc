const path = require('path');
const { v4: uuidv4 } = require('uuid');

exports.uploadFile = async (file, targetDirectory, prefix) => {
  if (!file) {
    return null;
  }

  const extname = path.extname(file.originalname || ''); // Maneja el caso en que file.originalname sea undefined
  const fileName = `${prefix}-${uuidv4()}${extname}`;

  const filePath = path.join(__dirname, targetDirectory, fileName);

  await file.mv(filePath);

  return fileName;
};
