import React, {Component} from 'react';
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
} from 'react-native';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/Ionicons';

export class index extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
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
      // person: this.props.navigation.getParam('data'),
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

  goChat = () => {
    // const person = this.props.navigation.getParam('data');
    // console.log('WORK GO CHAT', person);
    const go = this.props.navigation.navigate('ListChat');
    console.log('GOOO', go);
  };

  componentDidMount() {
    console.log('DIDMOUNT');
    // const param = this.props.navigation.getParam('data');
    // console.log('THIS GET PARAMS', this.state.person.data.fname);
    this.requestLocationPermission();
    this.currentPosition();
    this.getDataProfile();
  }

  render() {
    const {uri, fname, sex, age} = this.state;
    const data = this.props.navigation.getParam('data');

    // console.log('URL state', uri);
    // const sex = ['Female', 'Male'];
    // const {selectedIndex} = this.state;

    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <StatusBar
          translucent
          backgroundColor="white"
          barStyle="dark-content"
        />
        <TouchableHighlight
          onPress={() => this.props.navigation.navigate('Home')}
          activeOpacity={1}>
          <View
            style={{
              backgroundColor: 'white',
            }}>
            <Text
              style={{
                color: '#fff',
                marginTop: 40,
                alignSelf: 'center',
                fontSize: 26,
                fontWeight: 'bold',
                letterSpacing: 0.1,
                color: '#222',
                fontFamily: 'AirbnbCerealExtraBold',
              }}>
              Discover
            </Text>

            <Icon
              name={'ios-arrow-back'}
              size={28}
              color={'#222'}
              style={{marginLeft: 0, marginTop: -32, marginLeft: 25}}
            />
          </View>
        </TouchableHighlight>
        <ScrollView>
          <Image
            source={require('../../../assets/images/directions.png')}
            style={{
              top: '2%',
              width: '80%',
              height: 250,
              alignSelf: 'center',
            }}
          />
          <View style={{padding: 20, top: 10}}>
            <View
              style={{
                alignSelf: 'center',
                top: 0,

                height: 394,
                width: 335,
                backgroundColor: 'white',
                // borderWidth: 1,
                elevation: 3,
                borderRadius: 20,
              }}>
              {/* IMAGE DINAMIS */}
              <Image
                style={{
                  top: 0,
                  position: 'absolute',
                  left: 0,
                  width: 335,
                  height: 250,
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                }}
                source={{
                  uri:
                    data.data.uri ||
                    'https://www.wellnessodyssey.co.za/wp-content/uploads/2016/04/default-user-icon.png',
                }}
              />
              {/* END IMAGE DINAMIS */}
              <View
                style={{
                  // backgroundColor: 'white',
                  left: 20,
                  top: 255,
                  paddingRight: 15,
                }}>
                <Text
                  style={{
                    fontFamily: 'AirbnbCerealBold',
                    color: '#222',
                    fontSize: 22,
                    fontWeight: 'bold',
                    paddingRight: 15,
                  }}>
                  {data.data.fname}
                </Text>
              </View>
              <View
                style={{
                  // backgroundColor: 'white',
                  flexDirection: 'row',
                  top: 255,
                  paddingRight: 15,
                }}>
                <Text
                  style={{
                    fontFamily: 'AirbnbCerealBold',
                    fontSize: 16,
                    fontWeight: 'normal',
                    color: '#657686',
                    paddingRight: 15,
                    left: 20,
                  }}>
                  {data.data.sex},
                </Text>
                <Text
                  style={{
                    fontFamily: 'AirbnbCerealBold',
                    fontSize: 16,
                    fontWeight: 'normal',
                    color: '#657686',
                    paddingRight: 15,
                    left: 10,
                  }}>
                  {data.data.age}
                </Text>
              </View>

              <View
                style={{
                  width: 298,
                  // height: 45,
                  backgroundColor: '#1DA1F3',
                  alignSelf: 'center',
                  // top: 280,
                  top: '72%',
                  // left: 115,
                  elevation: 2,
                  borderRadius: 20,
                  // marginBottom: 20,
                }}>
                <TouchableOpacity onPress={this.goChat}>
                  <Text
                    style={{
                      alignSelf: 'center',
                      fontWeight: 'bold',
                      fontFamily: 'AirbnbCerealBold',
                      color: '#fff',
                      fontSize: 18,
                      // paddingHorizontal: 10,
                      paddingVertical: 9,
                      letterSpacing: 0.5,
                    }}>
                    Chat
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
