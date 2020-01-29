import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Image,
  ToastAndroid,
} from 'react-native';
import {Input} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import CurryImagePicker from '../CurryImagePicker';

export class index extends Component {
  state = {
    phone: '',
    fname: '',
    imageUri: null,
  };

  fname = text => {
    console.log('FNAME =', text);
    this.setState({fname: text});
  };

  phone = text => {
    console.log('PHONE =', text);
    this.setState({phone: text});
  };

  onCreateAccount = async () => {
    console.log('PRES');
    // Get the users ID
    const uid = auth().currentUser.uid;
    console.log('CUR ', uid);

    // Create a reference
    const ref = database().ref(`users/${uid}`);
    console.log('REF ', ref);

    const data = {
      fname: this.state.fname,
      phone: this.state.phone,
    };
    console.log('DATA U Detail = ', data);
    await AsyncStorage.setItem('fname', data.fname);
    await AsyncStorage.setItem('phone', data.phone);

    await ref
      .set({
        uid,
        fname: data.fname,
        phone: data.phone,
      })
      .then(data => {
        //success callback
        console.log('data = ', data);
        ToastAndroid.showWithGravity(
          'Welcome Friends',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        this.props.navigation.navigate('Home');
      })

      .catch(error => {
        //error callback
        console.log('error ', error);
      });
  };

  setFoodImage = image => {
    console.log('SETIMAGE');
    const imageUri = this.setState({imageUri: image});
    console.log('IMAGE URI: ', imageUri);
  };

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#1DA1F3'}}>
        <StatusBar
          translucent
          backgroundColor="#ededed"
          barStyle="dark-content"
        />
        <View
          style={{
            height: 82,
            borderBottomWidth: 1.5,
            borderBottomColor: '#1DA1F3',
            backgroundColor: '#fff',
            elevation: 3,
          }}>
          <Text
            style={{
              color: '#484848',
              marginTop: 38,
              marginLeft: 20,
              fontSize: 20,
              fontWeight: 'bold',
            }}>
            Complete detail
          </Text>
        </View>
        <View style={{flex: 1, backgroundColor: 'white'}}>
          <View>
            <CurryImagePicker
              image={this.props.image}
              onImagePicked={this.setFoodImage}
            />
            {/* <Image
              source={require('../../../assets/images/default-user.png')}
              style={{
                backgroundColor: '#dedede',
                alignSelf: 'center',
                marginTop: 80,
                borderRadius: 360,
                width: 100,
                height: 100,
              }}></Image> */}
            {/* <View
              style={{
                backgroundColor: 'black',
                height: 48,
                width: 100,
                marginTop: -46,
                borderBottomRightRadius: 360,
                borderBottomLeftRadius: 360,
                opacity: 0.5,
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  color: '#fff',
                  alignSelf: 'center',
                  paddingVertical: 10,
                  fontSize: 16,
                  fontWeight: 'normal',
                }}>
                Edit
              </Text>
            </View> */}
          </View>
          <View
            style={{
              marginTop: 80,
            }}>
            <Input
              paddingLeft={80}
              paddingRight={90}
              textAlign="center"
              placeholder="Complete your name"
              onChangeText={this.fname}
              value={this.state.fname}
            />
          </View>
          <View
            style={{
              marginTop: 30,
            }}>
            <Input
              paddingLeft={80}
              paddingRight={90}
              textAlign="center"
              keyboardType="phone-pad"
              placeholder="Enter your phone number"
              onChangeText={this.phone}
              value={this.state.phone}
            />
          </View>
        </View>
        <TouchableOpacity onPress={this.onCreateAccount}>
          <View style={{height: 60, backgroundColor: '#1DA1F3'}}>
            <Text
              style={{
                color: '#fff',
                fontSize: 18,
                fontWeight: 'normal',
                alignSelf: 'center',
                marginVertical: 15,
              }}>
              Register
            </Text>
          </View>
        </TouchableOpacity>
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
