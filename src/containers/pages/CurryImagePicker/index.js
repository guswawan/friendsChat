import React, {useState, useEffect} from 'react';
import {View, Button, Image, StyleSheet, TouchableOpacity} from 'react-native';
import IconAwesome from 'react-native-vector-icons/FontAwesome';
import CurryImagePicker from 'react-native-image-picker';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';

const ImagePicker = ({image, onImagePicked}) => {
  // Hook
  const [selectedImage, setSelectedImage] = useState();
  useEffect(() => {
    if (image) {
      console.log('useEffect: ' + image);
      selectedImage({uri: image});
    }
  }, [image]);

  const pickedImageHandler = async () => {
    // Get the users ID
    const uid = auth().currentUser.uid;
    console.log('UserID UID = ', uid);

    CurryImagePicker.showImagePicker(
      {
        title: 'Pick an Image',
        maxWidth: 800,
        maxHeight: 600,
      },
      res => {
        if (res.error) {
          console.log('Image error');
        } else {
          console.log('Image url: ' + res.uri);
          setSelectedImage({uri: res.uri});
          onImagePicked({uri: res.uri});

          firebase
            .storage()
            .ref(`/friendsPhotos/${uid}.jpg`)
            .putFile(res.uri)
            .on(
              'state_changed',
              snapshot => {
                console.log('SNAPSHOT', snapshot);
              },
              err => {
                console.error(err);
              },
              uploadedFile => {
                console.log('UPLOADED PHOTO', uploadedFile);
              },
            );
        }
      },
    );
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.imageContainer}>
        <Image source={selectedImage} style={styles.previewImage} />
      </View> */}
      <TouchableOpacity onPress={pickedImageHandler}>
        <View style={styles.button}>
          <IconAwesome
            name="camera"
            size={22}
            color="#ededed"
            style={{alignSelf: 'center'}}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  imageContainer: {
    backgroundColor: '#dedede',
    alignSelf: 'center',
    marginTop: 0,
    borderRadius: 360,
    width: 30,
    height: 30,
    borderWidth: 2.5,
    borderColor: '#fff',
  },
  button: {
    marginTop: -12,
    // opacity: 0.9,
    // marginLeft: 78,
    // backgroundColor: 'black',
  },
  previewImage: {
    borderRadius: 360,
    width: '100%',
    height: '100%',
  },
});

export default ImagePicker;
