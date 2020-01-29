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
    // this.updateIndex = this.updateIndex.bind(this);
    this.getImage();
  }

  fname = text => {
    console.log('FNAME =', text);
    this.setState({fname: text});
  };

  about = text => {
    console.log('ABOUT =', text);
    this.setState({about: text});
  };

  phone = text => {
    console.log('PHONE =', text);
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
    console.log('AGE =', text);
    this.setState({age: text});
  };

  setFoodImage = image => {
    console.log('SETIMAGE');
    const imageUri = this.setState({imageUri: image});
    console.log('IMAGE URI: ', imageUri);
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
        console.log('INI LATITUDE USER ', latuser);
        console.log('INI LONGITUDE USER ', longuser);
      },
      error => {
        Alert.alert(error.message.toString());
      },
      {
        showLocationDialog: true,
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      },
    );
  };

  getImage = () => {
    // Get the users ID
    const uid = auth().currentUser.uid;
    console.log('UID THIS USER = ', uid);

    firebase
      .storage()
      .ref(`/friendsPhotos/${uid}.jpg`)
      // .child(uid, '.jpg')
      .getDownloadURL()
      .then(uri => {
        console.log('URL GET IMAGE', uri);
        this.setState({
          uri: uri,
        });
      });
  };

  getDataProfile = async () => {
    this.getImage();

    // Get the users ID
    const uid = auth().currentUser.uid;
    console.log('UID THIS USER = ', uid);
    // const fname = await AsyncStorage.getItem('fname');
    // const phone = await AsyncStorage.getItem('phone');

    firebase
      .database()
      .ref(`users/${uid}`)
      .once('value', data => {
        let dataProfile = data.toJSON();
        console.log('dataProfile = ', dataProfile);
      })
      .then(res => {
        //success callback
        console.log('res data = ', res._snapshot.value);
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
        <TouchableOpacity onPress={this.patchPP}>
          <Image
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 360,
              borderColor: '#fff',
              borderWidth: 2.5,
            }}
            source={{
              uri:
                uri ||
                'https://www.wellnessodyssey.co.za/wp-content/uploads/2016/04/default-user-icon.png',
            }}
          />
        </TouchableOpacity>
        <CurryImagePicker
          image={this.props.image}
          onImagePicked={this.setFoodImage}
        />
        {this.getImage()}
      </Fragment>
    );
  }

  patchPP = async () => {
    this.getImage();
    console.log('PRESS CHANGED PP');
    // Get the users ID
    const uid = auth().currentUser.uid;
    console.log('CUR ', uid);

    // Create a reference
    const ref = database().ref(`users/${uid}`);
    console.log('REF ', ref);

    // await AsyncStorage.setItem('fname', data.fname);
    // await AsyncStorage.setItem('phone', data.phone);
    await ref
      .set({
        uid,
        fname: this.state.fname,
        phone: this.state.phone,
        about: this.state.about,
        sex: this.state.sex,
        age: this.state.age,
        uri: this.state.uri,
        latitude: this.state.latitude,
        longitude: this.state.longitude,
      })
      .then(res => {
        //success callback
        console.log('PP changed = ', res);
        this.getImage();
      })

      .catch(error => {
        //error callback
        console.log('error ', error);
      });
  };

  patchProfile = async () => {
    console.log('PRESS DONE PROFILE');
    // Get the users ID
    const uid = auth().currentUser.uid;
    console.log('CUR ', uid);

    // Create a reference
    const ref = database().ref(`users/${uid}`);
    console.log('REF ', ref);

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
    console.log('DATA U Detail = ', data);
    // await AsyncStorage.setItem('fname', data.fname);
    // await AsyncStorage.setItem('phone', data.phone);

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
        //success callback
        // console.log('data = ', res);
        ToastAndroid.showWithGravity(
          'Profile Updated',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
        this.props.navigation.navigate('Home');
      })
      .catch(error => {
        //error callback
        console.log('error ', error);
      });
  };

  componentDidMount() {
    console.log('DIDMOUNT');
    // this.getDataAsync();
    this.requestLocationPermission();
    this.currentPosition();
    this.getDataProfile();
    this.renderImage();
  }

  render() {
    const deviceWidth = Dimensions.get('window').width;
    const {uri} = this.state;
    console.log('URL state', uri);
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
          <Text
            style={{
              color: '#fff',
              marginTop: 38,
              marginLeft: 20,
              fontSize: 20,
              fontWeight: 'bold',
            }}>
            Edit Profile
          </Text>
          <View style={{left: '86%', marginTop: -25}}>
            {/* <IconAwesome name="check" size={20} color="#fff" /> */}
            <TouchableOpacity onPress={this.patchProfile}>
              <Text
                style={{
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: 16,
                  letterSpacing: 0.5,
                }}>
                Done
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* HEADER END */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              height: 250,
              backgroundColor: '#1DA1F3',
              // elevation: 3,
            }}></View>
          <View style={{marginTop: -195}}>
            <View
              style={{
                marginBottom: 70,
                // borderWidth: 1,
                width: 125,
                height: 125,
                alignSelf: 'center',
              }}>
              {this.renderImage()}
            </View>
          </View>

          <View
            style={{
              alignSelf: 'center',
              height: 380,
              width: 360,
              marginBottom: 5,
              backgroundColor: '#fff',
              elevation: 3,
              zIndex: 9,
              borderBottomRightRadius: 20,
              borderBottomLeftRadius: 20,
            }}>
            <View style={{backgroundColor: 'white', paddingRight: 15}}>
              <View
                style={{
                  marginTop: 20,
                  width: 360,
                  alignSelf: 'center',
                }}>
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
                      style={{
                        fontSize: 18,
                        color: '#bbb',
                        paddingRight: 30,
                      }}>
                      Status Message
                    </Text>
                  }
                />
              </View>
              <View
                style={{
                  marginTop: 20,
                  width: 360,
                  alignSelf: 'center',
                }}>
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
                      style={{
                        fontSize: 18,
                        color: '#bbb',
                        paddingRight: 30,
                      }}>
                      Full Name
                    </Text>
                  }
                />
              </View>

              <View
                style={{
                  marginTop: 15,
                  width: 360,
                  alignSelf: 'center',
                }}>
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
                      style={{
                        fontSize: 18,
                        color: '#bbb',
                        paddingRight: 30,
                      }}>
                      Phone
                    </Text>
                  }
                />
              </View>
              <View
                style={{
                  marginTop: 15,
                  // width: 360,
                  width: '100%',
                  alignSelf: 'center',
                }}>
                <Input
                  inputContainerStyle={{borderBottomWidth: 0}}
                  textAlign="right"
                  keyboardType="numeric"
                  placeholder="How old are you"
                  onChangeText={this.age}
                  value={this.state.age}
                  leftIcon={
                    <Text
                      marginLeft={-20}
                      color="#ededed"
                      style={{
                        fontSize: 18,
                        color: '#bbb',
                        paddingRight: 30,
                      }}>
                      Age
                    </Text>
                  }
                />
              </View>
              <View
                style={{
                  marginTop: 15,
                  width: 360,
                  // alignSelf: 'center',
                  marginLeft: 180,
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    color: '#bbb',
                    marginLeft: -162,
                    marginTop: 15,
                  }}>
                  Sex
                </Text>
                <ButtonGroup
                  style={{backgroundColor: 'white'}}
                  onPress={this.updateSex}
                  selectedIndex={selectedIndex}
                  buttons={sex}
                  containerStyle={{
                    height: 30,
                    width: 150,
                    borderColor: '#fff',
                    borderRadius: 10,
                    marginTop: -25,
                    // backgroundColor: '#1DA1F3',
                  }}
                />
              </View>
            </View>
          </View>

          <TouchableHighlight
            onPress={() => this.props.navigation.navigate('Home')}
            activeOpacity={1}>
            <Text
              style={{
                alignSelf: 'center',
                top: 9,
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
              }}>
              Back
            </Text>
          </TouchableHighlight>
        </ScrollView>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
});

export default index;
