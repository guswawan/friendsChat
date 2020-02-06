import React, {Component, Fragment} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  StyleSheet,
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
                style={styles.imgBackground}
              />
              <Text style={styles.txtDescTop}>
                Stay connected to the people
              </Text>
              <Text style={styles.txtDescBot}>are called friends</Text>
              <Image
                source={require('../../../assets/logo/logo-friends-blue.png')}
                style={styles.logo}
              />
              <View style={styles.conStarted}>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('RegisterOne')}>
                  <Text style={styles.txtStarted}>Get Started</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.conSignIn}>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('SignIn')}>
                  <Text style={styles.txtSignIn}>
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

const styles = StyleSheet.create({
  imgBackground: {
    width: 400,
    height: 500,
    alignSelf: 'center',
    marginTop: 200,
  },
  txtDescTop: {
    position: 'absolute',
    fontSize: 18,
    marginTop: 148,
    color: '#657686',
    width: 238,
    alignSelf: 'center',
    fontWeight: 'bold',
    // letterSpacing: 0.5,
    // borderWidth: 1,
  },
  txtDescBot: {
    position: 'absolute',
    fontSize: 18,
    marginTop: 174,
    color: '#657686',
    width: 144,
    alignSelf: 'center',
    fontWeight: 'bold',
    // letterSpacing: 0.5,
    // borderWidth: 1,
  },
  logo: {
    position: 'absolute',
    width: 50,
    height: 40,
    marginTop: 90,
    alignSelf: 'center',
  },
  conStarted: {
    position: 'absolute',
    zIndex: 2,
    top: 660,
    alignSelf: 'center',
    height: 45,
    width: 150,
    borderRadius: 25,
    elevation: 5,
    backgroundColor: '#1DA1f3',
  },
  txtStarted: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 9,
    alignSelf: 'center',
    color: '#fff',
  },
  conSignIn: {
    top: 20,
    alignSelf: 'center',
    width: '100%',
    paddingBottom: 20,
  },
  txtSignIn: {
    fontSize: 12,
    marginVertical: 9,
    color: '#657686',
    alignSelf: 'center',
    paddingBottom: 10,
  },
});

export default index;
