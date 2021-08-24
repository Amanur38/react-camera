import React, {useEffect, useState, useRef} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
  Animated,
} from 'react-native';

import {directoryPictures} from './helper/CameraHelper';
import ImageViewModal from './ImageView';

const RNFS = require('react-native-fs');
const width = Dimensions.get('screen').width;

const ImageGalleryScreen = ({props, navigation}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [localImages, setLocalImages] = useState([]);
  const [paginateImages, setPaginateImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewImageObject, setViewImageObject] = useState(null);
  const [isImageViewModalOpen, setIsImageViewModalOpen] = useState(false);

  var recordsPerPage = 4;

  useEffect(() => {
    RNFS.readDir(directoryPictures)
      .then(result => {
        setLocalImages(result);
        return Promise.all([RNFS.stat(result[0].path), result[0].path]);
      })
      .catch(err => {
      console.log("🚀 ~ file: Gallery.js ~ line 41 ~ useEffect ~ err", err)
      });
  }, [currentPage]);

  useEffect(() => {
    if (localImages.length > 0) {
      changePage(currentPage);
    }
  }, [localImages]);

  const pageChangesEffect = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const nextPage = () => {
    if (currentPage < numberOfPages()) {
      setCurrentPage(currentPage + 1);
      changePage(currentPage);
    }
  };

  const previewPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      changePage(currentPage);
    }
  };

  const changePage = (page, lastPage) => {
    let onlyPaginateImages = [];
    for (var i = (page - 1) * recordsPerPage; i < page * recordsPerPage; i++) {
      onlyPaginateImages.push(localImages[i]);
    }
    setPaginateImages(onlyPaginateImages);
    if (lastPage) setCurrentPage(page);
    pageChangesEffect();
  };

  const numberOfPages = () => {
    return Math.ceil(localImages.length / recordsPerPage);
  };

  const openImageViewModal = item => {
    setViewImageObject(item);
    setIsImageViewModalOpen(true);
  };

  if (isImageViewModalOpen) {
    navigation.setOptions({headerShown: false});
  } else {
    navigation.setOptions({headerShown: true});
  }

  const closeImageModal = () => {
    setIsImageViewModalOpen(false);
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => openImageViewModal(item)}
      activeOpacity={0.8}>
      <Image
        key={item.path}
        style={styles.image}
        source={{uri: `file://${item.path}`}}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{}}>
      <StatusBar barStyle={'dark-content'} />
      <ScrollView contentContainerStyle={styles.scrollViewContainer} style={{}}>
        <View>
          {paginateImages.length > 0 ? (
            <>
              <Animated.View // Special animatable View
                style={{
                  opacity: fadeAnim, // Bind opacity to animated value
                }}>
                <FlatList
                  numColumns={2}
                  data={paginateImages}
                  renderItem={renderItem}
                  keyExtractor={item => item.name}
                  style={{alignSelf: 'center'}}
                />
              </Animated.View>

              <View style={styles.paginationWrapper}>
                <TouchableOpacity
                  onPress={() => previewPage()}
                  activeOpacity={0.9}>
                  <Text
                    style={[
                      styles.commonText,
                      currentPage === 1 ? styles.currentPageText : null,
                    ]}>
                    Prev
                  </Text>
                </TouchableOpacity>
                <Text style={[styles.commonText, styles.currentPageText]}>
                  {currentPage}
                </Text>
                <TouchableOpacity
                  onPress={() => nextPage()}
                  activeOpacity={0.9}>
                  <Text
                    style={[
                      styles.commonText,
                      currentPage === numberOfPages()
                        ? styles.currentPageText
                        : null,
                    ]}>
                    Next
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => changePage(numberOfPages(), true)}
                  activeOpacity={0.9}>
                  <Text
                    style={[
                      styles.commonText,
                      currentPage === numberOfPages()
                        ? styles.currentPageText
                        : null,
                    ]}>
                    {numberOfPages()}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.noImageText}>No image found.</Text>
            </>
          )}
        </View>
      </ScrollView>
      {isImageViewModalOpen ? (
        <View style={styles.imageViewModalWrapper}>
          <ImageViewModal
            data={viewImageObject}
            isOpen={isImageViewModalOpen}
            onPress={closeImageModal}
          />
        </View>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    paddingVertical: 5,
  },
  noImageText: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  paginationWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 15,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 2,
  },
  commonText: {
    fontSize: 18,
    padding: 5,
  },
  currentPageText: {
    color: '#ccc',
  },
  image: {
    width: (width - 20) / 2,
    height: (width - 20) / 2,
    margin: 3,
  },
  imageViewModalWrapper: {
    position: 'absolute',
  },
});

export default ImageGalleryScreen;
