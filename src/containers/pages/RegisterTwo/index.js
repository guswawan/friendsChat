import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {Input} from 'react-native-elements';
import PasswordInputText from 'react-native-hide-show-password-input';
import firebase from '@react-native-firebase/app';

export class index extends Component {
  state = {
    password: '',
    errorMessage: null,
  };

  password = text => {
    console.log('PASS REGIS = ', text);
    this.setState({password: text});
  };

  handleRegisterPass = () => {
    console.log('handleRegisterPass');
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email)
      .then(() => this.props.navigation.navigate('SignIn'))
      .catch(error => this.setState({errorMessage: error.message}));
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
            Password
          </Text>
        </View>
        <View style={{flex: 1, backgroundColor: 'white'}}>
          {this.state.errorMessage && (
            <Text style={{color: 'red'}}>{this.state.errorMessage}</Text>
          )}
          <View
            style={{
              marginTop: 250,
            }}>
            <Input
              paddingLeft={80}
              paddingRight={90}
              secureTextEntry={true}
              textAlign="center"
              placeholder="Create a password"
              errorMessage="Must be 6 characters or more"
              onChangeText={this.password}
              value={this.state.password}
            />
            {/* <PasswordInputText
              value={this.state.password}
              onChangeText={password => this.setState({password})}
            /> */}
          </View>
        </View>
        <TouchableOpacity onPress={this.handleRegisterPass}>
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
