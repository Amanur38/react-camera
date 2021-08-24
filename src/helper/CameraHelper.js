import {Platform} from 'react-native';
const RNFS = require('react-native-fs');

const directoryHome = Platform.select({
  ios: `${RNFS.DocumentDirectoryPath}/strativ`,
  android: `${RNFS.ExternalStorageDirectoryPath}/strativ`,
});

const directoryPictures = `${directoryHome}/Pictures`;

const moveAttachmentPicture = async (filePathLocation, newFilepathLocation) => {

  return new Promise((resolve, reject) => {
    RNFS.mkdir(directoryPictures)
      .then(() => {
        RNFS.moveFile(filePathLocation, newFilepathLocation)
          .then(() => {
            resolve(true);
          })
          .catch(error => {
            reject(error);
          });
      })
      .catch(err => {
        reject(err);
      });
  });
};

export { directoryPictures, moveAttachmentPicture}
