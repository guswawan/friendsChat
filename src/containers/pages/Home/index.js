import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Image,
  StyleSheet,
  Alert,
  PermissionsAndroid,
  ToastAndroid,
} from 'react-native';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {BoxShadow} from 'react-native-shadow';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/Ionicons';
import OneSignal from 'react-native-onesignal';
import PushController from '../../../utils/PushController';

export class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      latitude: 0,
      longitude: 0,
      address: '',
      fname: '',
      uri: '',
      phone: '',
      sex: '',
      age: '',
      coordinates: [],
      dataUsers: [],
    };
    // OneSignal.init('d3b4e6c8-c3dc-4039-85c7-0b4c1b88e3fd', {
    //   kOSSettingsKeyAutoPrompt: true,
    // });

    // OneSignal.addEventListener('received', this.onReceived);
    // OneSignal.addEventListener('opened', this.onOpened);
    // OneSignal.addEventListener('ids', this.onIds);
  }

  // componentWillUnmount() {
  //   OneSignal.removeEventListener('received', this.onReceived);
  //   OneSignal.removeEventListener('opened', this.onOpened);
  //   OneSignal.removeEventListener('ids', this.onIds);
  // }

  // onReceived(notification) {
  //   console.log('Notification received: ', notification);
  // }

  // onOpened(openResult) {
  //   alert('Message: ', openResult.notification.payload.body);
  //   alert('Data: ', openResult.notification.payload.additionalData);
  //   alert('isActive: ', openResult.notification.isAppInFocus);
  //   alert('openResult: ', openResult);
  // }

  // onIds(device) {
  //   alert('Device info: ', device);
  // }
  //END ONESIGNAL //

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
        ToastAndroid.showWithGravity(
          'Getting your location',
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
        );
      } else {
        console.log('Location permission denied');
        ToastAndroid.showWithGravity(
          'Access denied to access location',
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
        );
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
        maximumAge: 0, //must be remove
      },
    );
  };

  getDataUser = async () => {
    const uid = auth().currentUser.uid;
    console.log('UID THIS USER = ', uid);

    firebase
      .database()
      .ref('users')
      .on('value', async snapshot => {
        let data = [];

        await Object.keys(snapshot.val()).map(key => {
          data.push({
            uid: key,
            data: snapshot.val()[key],
          });
        });
        await this.setState({
          dataUsers: data,
        });
      });
  };

  up = async () => {
    // Get the users ID
    const uid = auth().currentUser.uid;
    console.log('CUR ', uid);

    // Create a reference
    const ref = database().ref(`users/${uid}`);
    console.log('REF ', ref);

    const data = {
      fname: this.state.fname,
      phone: this.state.phone,
      sex: this.state.sex,
      age: this.state.age,
      uri: this.state.uri,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
    };
    console.log('DATA U Detail = ', data);

    await ref.set({
      uid,
      fname: data.fname,
      phone: data.phone,
      sex: data.sex,
      age: data.age,
      uri: data.uri,
      latitude: data.latitude,
      longitude: data.longitude,
    });
  };

  handleProfile = () => {
    this.props.navigation.navigate('Profile');
  };

  goListChat = () => {
    this.props.navigation.navigate('ListChat');
  };

  handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(res => {
        this.props.navigation.navigate('GetStarted');
      })
      .catch(err => {
        console.log(err);
      });
  };

  componentDidMount() {
    const {currentUser} = firebase.auth();
    this.setState({currentUser});
    this.currentPosition();
    this.requestLocationPermission();
    this.getDataUser();
  }

  _renderItem = ({item}) => {
    <View key={item.title}>
      <Text style={style.titleNotif}>{item.title}</Text>
      <Text style={styles.messageNotif}>{item.message}</Text>
    </View>;
  };

  render() {
    let myMap;
    const {currentUser} = this.state;

    const shadowOpt = {
      width: 393,
      alignSelf: 'center',
      height: 110,
      color: '#000',
      border: 7,
      radius: 45,
      opacity: 0.13,
      x: 0,
      y: -2.5,
    };

    return (
      <View style={{flex: 1, width: '100%'}}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />

        {/* MAP Start */}
        <MapView
          ref={ref => (myMap = ref)}
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={{flex: 1, ...StyleSheet.absoluteFillObject}}
          showsUserLocation={true}
          showsTraffic={true}
          showsPointsOfInterest={true}
          showsMyLocationButton={true}
          region={{
            latitude: this.state.latitude, //-7.7584874
            longitude: this.state.longitude, //110.3781121
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          {this.state.dataUsers.map(data => {
            {
              console.log('THIS DATA MAP ', data.data);
            }
            return (
              <Marker
                key={data.data.uid}
                title={data.data.fname}
                description={data.data.about}
                coordinate={{
                  latitude: Number(data.data.latitude),
                  longitude: Number(data.data.longitude),
                }}
                onPress={() => {
                  this.props.navigation.navigate('DetailMarker', {data});
                }}>
                <View onPress={this.up}>
                  <Image
                    style={styles.imgMarker}
                    source={{uri: data.data.uri}}
                  />
                  <View style={styles.dotMarker} />
                </View>
              </Marker>
            );
          })}
        </MapView>
        {/* MAP END */}

        {/* CURRENT USER */}
        <View style={styles.containerCurrentUser}>
          <Text style={styles.emailCurrent}>
            Hi, {currentUser && currentUser.email}
          </Text>
        </View>
        {/* END CURRENT USER */}

        {/* BOTTOM BAR START */}
        <View style={{flex: 1}}></View>
        <View
          style={{
            flex: 0,
            width: 393,
            alignSelf: 'center',
            justifyContent: 'flex-end',
            flexDirection: 'row',
            // backgroundColor: 'pink',
          }}>
          <BoxShadow setting={shadowOpt}>
            <View style={styles.BottomBar}>
              <View style={styles.shortLine} />
              <View
                style={{
                  // backgroundColor: 'green',
                  width: '76%',
                  alignSelf: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity onPress={this.handleProfile}>
                  <View style={styles.containerSignOut}>
                    <Icon
                      name={'md-finger-print'}
                      size={28}
                      color={'#222'}
                      style={{
                        alignSelf: 'center',
                      }}
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.goListChat}>
                  <View style={styles.containerCenter}>
                    <Icon
                      name={'ios-chatbubbles'}
                      size={28}
                      color={'#fff'}
                      style={{
                        alignSelf: 'center',
                      }}
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.handleSignOut}>
                  <View style={styles.containerSignOut}>
                    <Icon
                      name={'md-log-out'}
                      size={28}
                      color={'#222'}
                      style={{
                        alignSelf: 'center',
                      }}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </BoxShadow>
        </View>
        {/* BOTTOM BAR END */}
        {/* MAP End */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  BottomBar: {
    height: 110,
    width: '100%',
    alignSelf: 'center',
    opacity: 0.97,
    backgroundColor: '#fff',
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    justifyContent: 'space-around',
  },
  shortLine: {
    height: 3,
    borderRadius: 100,
    backgroundColor: '#e1e1e1',
    width: 20,
    marginTop: 0,
    alignSelf: 'center',
  },
  emailCurrent: {
    alignSelf: 'center',
    fontWeight: 'bold',
    fontFamily: 'AirbnbCerealBold',
    fontSize: 14,
    letterSpacing: 0.2,
    padding: 5,
  },
  containerSignOut: {
    top: -10,
    height: 60,
    width: 60,
    backgroundColor: '#fff',
    borderRadius: 100,
    elevation: 3,
    paddingTop: 16,
    paddingLeft: 0,
  },
  containerCenter: {
    top: -10,
    height: 60,
    width: 60,
    backgroundColor: '#1DA1F3',
    borderRadius: 100,
    elevation: 3,
    paddingTop: 16,
    paddingLeft: 0,
  },
  txtSignOut: {
    paddingVertical: 12,
    paddingHorizontal: 11,
    color: '#000',
    alignSelf: 'center',
  },
  imgMarker: {
    width: 45,
    height: 45,
    borderRadius: 360,
    borderColor: '#fff',
    borderWidth: 1.5,
  },
  dotMarker: {
    backgroundColor: '#fff',
    elevation: 1,
    width: 6,
    height: 6,
    borderRadius: 100,
    marginTop: 5,
    alignSelf: 'center',
  },
  containerCurrentUser: {
    backgroundColor: '#fff',
    width: '50%',
    alignSelf: 'center',
    borderRadius: 10,
    top: 50,
    opacity: 0.8,
    elevation: 5,
  },
  titleNotif: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 10,
  },
  messageNotif: {
    fontSize: 14,
    paddingBottom: 15,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
});

export default index;
