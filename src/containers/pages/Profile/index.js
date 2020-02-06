import React, {Component, Fragment} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  StatusBar,
  Image,
  ToastAndroid,
  PermissionsAndroid,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {Input, ButtonGroup} from 'react-native-elements';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import CurryImagePicker from '../CurryImagePicker';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-community/async-storage';

export class index extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      uid: '',
      phone: '',
      fname: '',
      about: '',
      sex: '',
      age: '',
      uri: '',
      imageUri: '',
      coordinates: [],
      latitude: 0,
      longitude: 0,
      selectedIndex: 1,
    };
  }

  fname = text => {
    this.setState({fname: text});
  };

  about = text => {
    this.setState({about: text});
  };

  phone = text => {
    this.setState({phone: text});
  };

  updateSex = selectedIndex => {
    const sex = ['Female', 'Male'];

    this.setState({
      selectedIndex: selectedIndex,
      sex: sex[selectedIndex],
    });
  };

  age = text => {
    this.setState({age: text});
  };

  setFoodImage = image => {
    this.setState({imageUri: image});
  };

  requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'Friends App needs access to your location ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use location');
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  currentPosition = async () => {
    Geolocation.getCurrentPosition(
      position => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          coordinates: this.state.coordinates.concat({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }),
        });
        const latuser = this.state.latitude;
        const longuser = this.state.longitude;
        console.log('THIS LATITUDE USER ', latuser);
        console.log('THIS LONGITUDE USER ', longuser);
      },
      error => {
        Alert.alert(error.message.toString());
      },
      {
        showLocationDialog: true,
        enableHighAccuracy: true,
        timeout: 20000,
        // maximumAge: 0,
      },
    );
  };

  getImage = () => {
    // Get the users ID
    const uid = auth().currentUser.uid;

    firebase
      .storage()
      .ref(`/friendsPhotos/${uid}.jpg`)
      .getDownloadURL()
      .then(uri => {
        this.setState({
          uri: uri,
        });
      });
  };

  getDataProfile = async () => {
    this.getImage();

    // Get the users ID
    const uid = auth().currentUser.uid;

    firebase
      .database()
      .ref(`users/${uid}`)
      .once('value', data => {
        let dataProfile = data.toJSON();
        console.log('dataProfile = ', dataProfile);
      })
      .then(res => {
        //success callback
        AsyncStorage.setItem('fname', res._snapshot.value.fname);
        AsyncStorage.setItem('userId', res._snapshot.value.uid);
        AsyncStorage.setItem('uri', res._snapshot.value.uri);
        this.setState({
          fname: res._snapshot.value.fname,
          phone: res._snapshot.value.phone,
          age: res._snapshot.value.age,
          sex: res._snapshot.value.sex,
          about: res._snapshot.value.about,
        });
      })
      .catch(error => {
        //error callback
        console.log('error ', error);
      });
  };

  renderImage() {
    const {uri} = this.state;
    return (
      <Fragment>
        <Image
          style={styles.imgProfile}
          source={{
            uri:
              uri ||
              'https://www.wellnessodyssey.co.za/wp-content/uploads/2016/04/default-user-icon.png',
          }}
        />
        <CurryImagePicker
          image={this.props.image}
          onImagePicked={this.setFoodImage}
        />
        {this.getImage()}
      </Fragment>
    );
  }

  patchProfile = async () => {
    console.log('PRESS DONE PROFILE');
    // Get the users ID
    const uid = auth().currentUser.uid;

    // Create a reference
    const ref = database().ref(`users/${uid}`);

    const data = {
      fname: this.state.fname,
      phone: this.state.phone,
      about: this.state.about,
      sex: this.state.sex,
      age: this.state.age,
      uri: this.state.uri,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
    };

    await ref
      .set({
        uid,
        fname: data.fname,
        phone: data.phone,
        about: data.about,
        sex: data.sex,
        age: data.age,
        uri: data.uri,
        latitude: data.latitude,
        longitude: data.longitude,
      })
      .then(res => {
        ToastAndroid.showWithGravity(
          'Profile Updated',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
        this.props.navigation.navigate('Home');
      })
      .catch(error => {
        console.log('error ', error);
      });
  };

  componentDidMount() {
    this.requestLocationPermission();
    this.currentPosition();
    this.getDataProfile();
    this.renderImage();
  }

  render() {
    const deviceWidth = Dimensions.get('window').width;
    const {uri} = this.state;
    const sex = ['Female', 'Male'];
    const {selectedIndex} = this.state;

    return (
      <View style={{flex: 1, backgroundColor: 'white', deviceWidth}}>
        <StatusBar
          translucent
          backgroundColor="#1DA1F3"
          barStyle="light-content"
        />

        {/* HEADER START */}
        <View style={{backgroundColor: '#1DA1F3', paddingBottom: 15}}>
          <Text style={styles.txtHeader}>Edit Profile</Text>
          <View style={{left: '86%', marginTop: -25}}>
            <TouchableOpacity onPress={this.patchProfile}>
              <Text style={styles.txtDone}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* HEADER END */}

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.sectionTop} />
          <View style={{marginTop: -195}}>
            <View style={styles.imgProfileCircle}>{this.renderImage()}</View>
          </View>

          {/* SECTION CONTENT START*/}
          <View style={styles.conCard}>
            <View style={{backgroundColor: 'white', paddingRight: 15}}>
              <View style={styles.contentStatus}>
                <Input
                  inputContainerStyle={{borderBottomWidth: 0}}
                  value={this.state.about}
                  onChangeText={this.about}
                  placeholder="Write your status"
                  textAlign="right"
                  leftIcon={
                    <Text
                      marginLeft={-20}
                      color="#ededed"
                      style={styles.txtStatus}>
                      Status Message
                    </Text>
                  }
                />
              </View>
              <View style={styles.contentName}>
                <Input
                  inputContainerStyle={{borderBottomWidth: 0}}
                  value={this.state.fname}
                  onChangeText={this.fname}
                  placeholder="Complete your name"
                  textAlign="right"
                  leftIcon={
                    <Text
                      marginLeft={-20}
                      color="#ededed"
                      style={styles.txtName}>
                      Full Name
                    </Text>
                  }
                />
              </View>
              <View style={styles.contentPhone}>
                <Input
                  inputContainerStyle={{borderBottomWidth: 0}}
                  value={this.state.phone}
                  onChangeText={this.phone}
                  placeholder="Enter your number"
                  textAlign="right"
                  keyboardType="phone-pad"
                  leftIcon={
                    <Text
                      marginLeft={-20}
                      color="#ededed"
                      style={styles.txtPhone}>
                      Phone
                    </Text>
                  }
                />
              </View>
              <View style={styles.contentAge}>
                <Input
                  inputContainerStyle={{borderBottomWidth: 0}}
                  textAlign="right"
                  keyboardType="numeric"
                  placeholder="How old are you"
                  onChangeText={this.age}
                  value={this.state.age}
                  leftIcon={
                    <Text color="#ededed" style={styles.txtAge}>
                      Age
                    </Text>
                  }
                />
              </View>
              <View style={styles.contentSex}>
                <Text style={styles.txtSex}>Sex</Text>
                <ButtonGroup
                  style={{backgroundColor: 'white'}}
                  onPress={this.updateSex}
                  selectedIndex={selectedIndex}
                  buttons={sex}
                  containerStyle={styles.btnSelected}
                />
              </View>
            </View>
          </View>
          {/* SECTION CONTENT END */}

          <TouchableHighlight
            onPress={() => this.props.navigation.navigate('Home')}
            activeOpacity={1}>
            <Text style={styles.btnBack}>Back</Text>
          </TouchableHighlight>
        </ScrollView>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  imgProfile: {
    width: '100%',
    height: '100%',
    borderRadius: 360,
    borderColor: '#fff',
    borderWidth: 2.5,
  },
  txtHeader: {
    color: '#fff',
    marginTop: 38,
    marginLeft: 20,
    fontSize: 20,
    fontWeight: 'bold',
  },
  txtDone: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  sectionTop: {
    height: 250,
    backgroundColor: '#1DA1F3',
  },
  imgProfileCircle: {
    marginBottom: 70,
    width: 125,
    height: 125,
    alignSelf: 'center',
  },
  conCard: {
    alignSelf: 'center',
    height: 380,
    width: 360,
    marginBottom: 5,
    backgroundColor: '#fff',
    elevation: 3,
    zIndex: 9,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  contentStatus: {
    marginTop: 20,
    width: 360,
    alignSelf: 'center',
  },
  txtStatus: {
    fontSize: 18,
    color: '#bbb',
    paddingRight: 30,
  },
  contentName: {
    marginTop: 20,
    width: 360,
    alignSelf: 'center',
  },
  txtName: {
    fontSize: 18,
    color: '#bbb',
    paddingRight: 30,
  },
  contentPhone: {
    marginTop: 15,
    width: 360,
    alignSelf: 'center',
  },
  txtPhone: {
    fontSize: 18,
    color: '#bbb',
    paddingRight: 30,
  },
  contentAge: {
    marginTop: 15,
    width: '100%',
    alignSelf: 'center',
  },
  txtAge: {
    fontSize: 18,
    color: '#bbb',
    left: -5,
    paddingRight: 30,
  },
  contentSex: {
    marginTop: 15,
    width: 360,
    marginLeft: 180,
  },
  txtSex: {
    fontSize: 18,
    color: '#bbb',
    marginLeft: -162,
    marginTop: 15,
  },
  btnSelected: {
    height: 30,
    width: 150,
    borderColor: '#fff',
    borderRadius: 10,
    marginTop: -25,
  },
  btnBack: {
    alignSelf: 'center',
    top: 10,
    color: '#1DA1F3',
    backgroundColor: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    paddingHorizontal: 50,
    paddingVertical: 10,
    letterSpacing: 0.5,
    elevation: 3,
    borderRadius: 50,
    marginBottom: 20,
  },
});

export default index;
