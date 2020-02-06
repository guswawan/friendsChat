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
    this.setState({email: text});
  };

  password = text => {
    this.setState({password: text});
  };

  goNext = () => {
    this.props.navigation.navigate('RegisterThree');
  };

  handleRegisterEmail = async () => {
    // console.log('handleRegisterEmail');
    await AsyncStorage.setItem('uid', this.state.uid);
    await AsyncStorage.setItem('email', this.state.email);

    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(res => {
        this.goNext();
        // console.log('RES FIRE =', res);
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
          <View style={styles.conTitle}>
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
              <View style={styles.conFormEmail}>
                <Input
                  label="Email"
                  onChangeText={this.email}
                  value={this.state.email}
                />
              </View>
              <View style={styles.conFormPass}>
                <Input
                  secureTextEntry={true}
                  label="Password"
                  onChangeText={this.password}
                  value={this.state.password}
                />
              </View>
              <Image
                style={styles.img}
                source={require('../../../assets/images/connection.png')}
              />
            </View>
          </ScrollView>
        </View>

        <TouchableOpacity onPress={this.handleRegisterEmail}>
          <View style={{height: 60, backgroundColor: '#1DA1F3'}}>
            <Text style={styles.btnNext}>Next</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  conTitle: {
    marginTop: 25,
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 45,
  },
  conFormEmail: {
    marginTop: 90,
    width: 315,
    alignSelf: 'center',
  },
  conFormPass: {
    marginTop: 40,
    width: 315,
    alignSelf: 'center',
  },
  img: {
    alignSelf: 'center',
    width: 359,
    height: 250,
    marginTop: 10,
    zIndex: 0,
  },
  btnNext: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'normal',
    alignSelf: 'center',
    marginVertical: 15,
  },
});

export default index;
