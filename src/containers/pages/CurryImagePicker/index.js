import React, {useState, useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import IconAwesome from 'react-native-vector-icons/FontAwesome';
import CurryImagePicker from 'react-native-image-picker';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';

const ImagePicker = ({image, onImagePicked}) => {
  //Hook
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
      <TouchableOpacity onPress={pickedImageHandler} activeOpacity={1.0}>
        <View style={styles.button}>
          <IconAwesome
            name="camera"
            size={16}
            color="#1DA1F3"
            style={styles.icon}
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
  button: {
    width: 32,
    height: 32,
    marginTop: -17,
    backgroundColor: 'white',
    opacity: 0.9,
    borderRadius: 100,
  },
  icon: {
    alignSelf: 'center',
    top: 8,
  },
});

export default ImagePicker;
