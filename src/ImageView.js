import React from 'react';
import {
  StyleSheet,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const ImageViewModal = props => {
  return (
    <>
      {props.data ? (
        <>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => props.onPress()}>
            <Text style={styles.closeText}>&#10006;</Text>
          </TouchableOpacity>
          <Image
            style={styles.image}
            source={{uri: `file://${props.data.path}`}}
          />
        </>
      ) : (
        <Text>Something went wrong. Please close the App and open again.</Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  noImageText: {
    marginTop:  8,
    fontSize:   18,
    fontWeight: '400',
  },
  image: {
    width:  width,
    height: height,
  },
  closeButton: {
    position: 'absolute',
    zIndex:   1,
    right:    10,
    top:      5,
    padding: 5
  },
  closeText: {
    fontSize: 22,
    color:    '#CCC',
  },
});

export default ImageViewModal;
