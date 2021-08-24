'use strict';
import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  PermissionsAndroid,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {moveAttachmentPicture, directoryPictures} from './helper/CameraHelper';
const moment = require('moment');

const HomeScreen = props => {
  let cameraRef = useRef(null);

  const [isOpenCamera, setIsOpenCamera] = useState(false);

  useEffect(async() => {
    try {
      const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
      await PermissionsAndroid.request(permission);
      Promise.resolve();
    } catch (error) {
      Promise.reject(error);
    }
  }, []);

  const takePicture = async () => {
    if (cameraRef) {
      const options = {quality: 1, base64: true};
      const data = await cameraRef.takePictureAsync(options);
      saveImage(data.uri);
    }
  };

  const saveImage = async filePath => {
    try {
      const pictureName = `${moment().format('DDMMYY_HHmmSSS')}.jpg`;
      const newFilepath = `${directoryPictures}/${pictureName}`;
      await moveAttachmentPicture(filePath, newFilepath);
    } catch (error) {
      Alert.alert('Message', "Image can't save on phone storage.");
    }
  };

  return (
    <View style={styles.container}>
      {!isOpenCamera ? (
        <>
          <TouchableOpacity
            onPress={() => setIsOpenCamera(!isOpenCamera)}
            style={styles.capture}>
            <Text style={styles.moduleButtonText}>Open Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('ImageGallery')}
            style={styles.capture}>
            <Text style={styles.moduleButtonText}>Open Gallery</Text>
          </TouchableOpacity>
        </>
      ) : null}
      {isOpenCamera ? (
        <>
          <RNCamera
            ref={refs => (cameraRef = refs)}
            style={styles.preview}
            type={RNCamera.Constants.Type.back}
            playSoundOnCapture={true}
            flashMode={RNCamera.Constants.FlashMode.off}
          />
          <View style={styles.cameraActionButtonWrapper}>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('ImageGallery')}
              style={styles.capture}>
              <Text style={styles.buttonText}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => takePicture()}
              style={styles.capture}>
              <Text style={styles.buttonText}>Capture</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsOpenCamera(!isOpenCamera)}
              style={styles.capture}>
              <Text style={styles.buttonText}>&#10006;</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cameraActionButtonWrapper: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 1,
  },
  buttonText: {
    fontSize: 18,
  },
  moduleButtonText: {
    fontSize: 24,
    fontWeight: '700',
  },
});

export default HomeScreen;
