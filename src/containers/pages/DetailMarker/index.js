import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  StatusBar,
  Image,
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
      selectedIndex: 1,
    };
    this.getImage();
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

  goChat = () => {
    this.props.navigation.navigate('ListChat');
  };

  componentDidMount() {
    this.requestLocationPermission();
    this.currentPosition();
    this.getDataProfile();
  }

  render() {
    const data = this.props.navigation.getParam('data');

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
          <View style={styles.conHeader}>
            <Text style={styles.txtHeader}>Discover</Text>
            <Icon
              name={'ios-arrow-back'}
              size={28}
              color={'#222'}
              style={styles.iconArrowBack}
            />
          </View>
        </TouchableHighlight>

        <ScrollView>
          <Image
            source={require('../../../assets/images/directions.png')}
            style={styles.imgDiscover}
          />
          <View style={{padding: 20, top: 10}}>
            <View style={styles.conCard}>
              <Image
                style={styles.imgMarker}
                source={{
                  uri:
                    data.data.uri ||
                    'https://www.wellnessodyssey.co.za/wp-content/uploads/2016/04/default-user-icon.png',
                }}
              />
              <View style={styles.confName}>
                <Text style={styles.txtfName}>{data.data.fname}</Text>
              </View>
              <View style={styles.conDesc}>
                <Text style={styles.txtSex}>{data.data.sex},</Text>
                <Text style={styles.txtAge}>{data.data.age}</Text>
              </View>
              <View style={styles.conBtnChat}>
                <TouchableOpacity onPress={this.goChat}>
                  <Text style={styles.txtBtnChat}>Chat</Text>
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
  conHeader: {
    backgroundColor: 'white',
  },
  txtHeader: {
    color: '#fff',
    marginTop: 40,
    alignSelf: 'center',
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: 0.1,
    color: '#222',
    fontFamily: 'AirbnbCerealExtraBold',
  },
  iconArrowBack: {
    marginLeft: 0,
    marginTop: -32,
    marginLeft: 25,
  },
  imgDiscover: {
    top: '2%',
    width: '80%',
    height: 250,
    alignSelf: 'center',
  },
  conCard: {
    alignSelf: 'center',
    top: 0,
    height: 394,
    width: 335,
    backgroundColor: 'white',
    elevation: 3,
    borderRadius: 20,
  },
  imgMarker: {
    top: 0,
    position: 'absolute',
    left: 0,
    width: 335,
    height: 250,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  confName: {
    left: 20,
    top: 255,
    paddingRight: 15,
  },
  txtfName: {
    fontFamily: 'AirbnbCerealBold',
    color: '#222',
    fontSize: 22,
    fontWeight: 'bold',
    paddingRight: 15,
  },
  conDesc: {
    flexDirection: 'row',
    top: 255,
    paddingRight: 15,
  },
  txtSex: {
    fontFamily: 'AirbnbCerealBold',
    fontSize: 16,
    fontWeight: 'normal',
    color: '#657686',
    paddingRight: 15,
    left: 20,
  },
  txtAge: {
    fontFamily: 'AirbnbCerealBold',
    fontSize: 16,
    fontWeight: 'normal',
    color: '#657686',
    paddingRight: 15,
    left: 10,
  },
  conBtnChat: {
    width: 298,
    backgroundColor: '#1DA1F3',
    alignSelf: 'center',
    top: '72%',
    elevation: 2,
    borderRadius: 20,
  },
  txtBtnChat: {
    alignSelf: 'center',
    fontWeight: 'bold',
    fontFamily: 'AirbnbCerealBold',
    color: '#fff',
    fontSize: 18,
    paddingVertical: 9,
    letterSpacing: 0.5,
  },
});

export default index;
