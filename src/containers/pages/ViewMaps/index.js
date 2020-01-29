import React, {Component, Fragment} from 'react';
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
import AsyncStorage from '@react-native-community/async-storage';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

export class index extends Component {
  constructor() {
    super();
    this.state = {
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
  }

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
        maximumAge: 0,
      },
    );
  };

  getDataUser = async () => {
    // Get the users ID
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
        console.log('data ALL user = ', this.state.dataUser);
        // console.log('data ALL user image = ', data.uri);
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

  goDetailMarker = () => {
    console.log(
      'DETAIL MARKER KUY',
      this.props.navigation.navigate('DetailMarker'),
    );
    alert('WORK');
    this.props.navigation.navigate('DetailMarker');
  };

  componentDidMount() {
    this.requestLocationPermission();
    this.currentPosition();
    this.getDataUser();
  }

  render() {
    let myMap;
    return (
      <Fragment>
        <MapView
          ref={ref => (myMap = ref)}
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={{flex: 1, ...StyleSheet.absoluteFillObject}}
          showsUserLocation={true}
          showsMyLocationButton={true}
          region={{
            latitude: this.state.latitude, //-7.7584874
            longitude: this.state.longitude, //110.3781121
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          {this.state.dataUsers.map(data => {
            {
              console.log('INI DATA MAP ', data.data);
            }
            return (
              <Marker
                key={data.data.uid}
                // onPress={this.goDetailMarker}
                coordinate={{
                  latitude: Number(data.data.latitude),
                  longitude: Number(data.data.longitude),
                }}
                title={data.data.fname}
                description={data.data.about}
                onCalloutPress={() => {
                  this.props.screenProps.content.navigate('DetailMarker', {
                    data,
                  });
                }}>
                {/* <TouchableOpacity onPress={this.goDetailMarker}> */}
                <View onPress={this.up}>
                  <Image
                    style={{
                      width: 45,
                      height: 45,
                      borderRadius: 360,
                      borderColor: '#fff',
                      borderWidth: 1.5,
                    }}
                    source={{
                      uri: data.data.uri,
                    }}
                  />
                  <View
                    style={{
                      backgroundColor: '#fff',
                      elevation: 1,
                      width: 6,
                      height: 6,
                      borderRadius: 100,
                      marginTop: 5,
                      alignSelf: 'center',
                    }}
                  />
                </View>
                {/* </TouchableOpacity> */}
              </Marker>
            );
          })}
        </MapView>
      </Fragment>
    );
  }
}

export default index;
