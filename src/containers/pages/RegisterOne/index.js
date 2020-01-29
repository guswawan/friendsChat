import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import {Input, Icon} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from '@react-native-firebase/app';
import {ScrollView} from 'react-native-gesture-handler';

export class index extends Component {
  state = {
    uid: '',
    email: '',
    password: '',
    errorMessage: null,
  };

  email = text => {
    console.log('EMAIL REGIS =', text);
    this.setState({email: text});
  };

  password = text => {
    console.log('PASS REGIS = ', text);
    this.setState({password: text});
  };

  goNext = () => {
    console.log('GO NEXT');
    this.props.navigation.navigate('RegisterThree');
  };

  handleRegisterEmail = async () => {
    console.log('handleRegisterEmail');
    await AsyncStorage.setItem('uid', this.state.uid);
    await AsyncStorage.setItem('email', this.state.email);

    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(res => {
        console.log('RES FIRE =', res);
        this.goNext();
      })

      .catch(error => this.setState({errorMessage: error.message}));
  };

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#1DA1F3'}}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <View style={{flex: 1, backgroundColor: 'white'}}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('GetStarted')}>
            <Icon
              reverse
              name="md-arrow-round-back"
              type="ionicon"
              color="#1DA1F3"
              size={22}
              marginTop={50}
              marginLeft={30}
            />
          </TouchableOpacity>
          <View
            style={{
              marginTop: 25,
              fontSize: 12,
              fontWeight: 'bold',
              marginLeft: 45,
            }}>
            <Text style={{fontSize: 32, fontWeight: 'bold'}}>
              Create account
            </Text>
            <Text style={{left: 2}}>Please register your account</Text>
          </View>
          {this.state.errorMessage && (
            <Text style={{color: 'red', marginLeft: 45, width: 250}}>
              {this.state.errorMessage}
            </Text>
          )}
          <ScrollView showsVerticalScrollIndicator={false}>
            <View width="100%">
              <View
                style={{
                  marginTop: 90,
                  width: 315,
                  alignSelf: 'center',
                }}>
                <Input
                  label="Email"
                  onChangeText={this.email}
                  value={this.state.email}
                />
              </View>
              <View
                style={{
                  marginTop: 40,
                  width: 315,
                  alignSelf: 'center',
                }}>
                <Input
                  secureTextEntry={true}
                  label="Password"
                  onChangeText={this.password}
                  value={this.state.password}
                />
              </View>

              <Image
                style={{
                  // backgroundColor: 'pink',
                  alignSelf: 'center',
                  width: 359,
                  height: 250,
                  marginTop: 10,
                  zIndex: 0,
                }}
                source={require('../../../assets/images/connection.png')}
              />
            </View>
          </ScrollView>
        </View>

        <TouchableOpacity onPress={this.handleRegisterEmail}>
          <View style={{height: 60, backgroundColor: '#1DA1F3'}}>
            <Text
              style={{
                color: '#fff',
                fontSize: 18,
                fontWeight: 'normal',
                alignSelf: 'center',
                marginVertical: 15,
              }}>
              Next
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
