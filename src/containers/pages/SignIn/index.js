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
import firebase from '@react-native-firebase/app';
import {ScrollView} from 'react-native-gesture-handler';

export class index extends Component {
  state = {
    email: '',
    password: '',
    errorMessage: null,
  };

  email = text => {
    console.log('EMAIL =', text);
    this.setState({email: text});
  };

  password = text => {
    console.log('PASSWORD =', text);
    this.setState({password: text});
  };

  handleSignIn = () => {
    // TODO: Firebase stuff...
    console.log('handleSignIn');
    const {email, password} = this.state;
    console.log('EMAIL ', email);
    console.log('PASSWORD ', password);
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(res => {
        console.log('RES Handle SignIn =', res);
        ToastAndroid.showWithGravity(
          `Welcome ${email} `,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        this.props.navigation.navigate('Home');
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
          <ScrollView showsVerticalScrollIndicator={false}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('RegisterOne')}>
              <View
                style={{
                  left: '80%',
                  marginTop: '10%',
                  // marginTop: 40,
                  // backgroundColor: 'pink',
                }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 17,
                    color: '#1DA1F3',
                  }}>
                  Sign Up
                </Text>
              </View>
            </TouchableOpacity>
            <View
              style={{
                marginTop: 50,
                fontSize: 12,
                fontWeight: 'bold',
                marginLeft: 45,
              }}>
              <Text style={{fontSize: 32, fontWeight: 'bold'}}>
                Hi, Friends!
              </Text>
              <Text>Please Sign In with your account</Text>
            </View>
            {this.state.errorMessage && (
              <Text style={{color: 'red', width: 250, marginLeft: 45}}>
                {this.state.errorMessage}
              </Text>
            )}

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
                width: 453,
                height: 270,
                marginTop: 10,
              }}
              source={require('../../../assets/images/mobile-login.png')}></Image>
          </ScrollView>
        </View>
        <TouchableOpacity onPress={this.handleSignIn}>
          <View style={{height: 60, backgroundColor: '#1DA1F3'}}>
            <Text
              style={{
                color: '#fff',
                fontSize: 18,
                fontWeight: 'normal',
                alignSelf: 'center',
                marginVertical: 15,
              }}>
              Sign In
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
