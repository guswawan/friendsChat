import React, {Component, Fragment} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  ImageBackground,
} from 'react-native';

export class index extends Component {
  render() {
    return (
      <Fragment>
        <View style={{flex: 1, backgroundColor: 'white'}}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <StatusBar
              translucent
              backgroundColor="transparent"
              barStyle="dark-content"
            />
            <View style={{flex: 1, width: '100%'}}>
              <ImageBackground
                source={require('../../../assets/images/friendship.png')}
                style={{
                  width: 400,
                  height: 500,
                  alignSelf: 'center',
                  marginTop: 200,
                }}
              />
              <Text
                style={{
                  position: 'absolute',
                  fontSize: 18,
                  marginTop: 148,
                  color: '#657686',
                  width: 238,
                  alignSelf: 'center',
                  fontWeight: 'bold',
                  // letterSpacing: 0.5,
                  // borderWidth: 1,
                }}>
                Stay connected to the people
              </Text>
              <Text
                style={{
                  position: 'absolute',
                  fontSize: 18,
                  marginTop: 174,
                  color: '#657686',
                  width: 144,
                  alignSelf: 'center',
                  fontWeight: 'bold',
                  // letterSpacing: 0.5,
                  // borderWidth: 1,
                }}>
                are called friends
              </Text>
              <Image
                source={require('../../../assets/logo/logo-friends-blue.png')}
                style={{
                  position: 'absolute',
                  width: 50,
                  height: 40,
                  marginTop: 90,
                  alignSelf: 'center',
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  zIndex: 2,
                  top: 660,
                  alignSelf: 'center',
                  height: 45,
                  width: 150,
                  borderRadius: 25,
                  elevation: 5,
                  backgroundColor: '#1DA1f3',
                }}>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('RegisterOne')}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      marginVertical: 9,
                      alignSelf: 'center',
                      color: '#fff',
                    }}>
                    Get Started
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  top: 20,
                  alignSelf: 'center',
                  width: '100%',
                  paddingBottom: 20,
                }}>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('SignIn')}>
                  <Text
                    style={{
                      fontSize: 12,
                      marginVertical: 9,
                      color: '#657686',
                      alignSelf: 'center',
                      paddingBottom: 10,
                    }}>
                    Already have an account?{' '}
                    <Text style={{fontWeight: 'bold'}}>Sign In</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Fragment>
    );
  }
}

export default index;
