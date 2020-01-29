import React, {Fragment} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  AsyncStorage,
  RefreshControl,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import Icon from 'react-native-vector-icons/Ionicons';
import {ScrollView} from 'react-native-gesture-handler';

export default class index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
      refreshing: false,
      uid: '',
      //   personUid: '',
    };
  }

  componentDidMount = async () => {
    // Get the users ID
    const uid = auth().currentUser.uid;
    console.log('UID THIS USER = ', uid);

    this.setState({uid: uid, refreshing: true});

    await firebase
      .database()
      .ref('/users')
      .on('child_added', data => {
        let person = data.val();
        if (person.uid != uid) {
          console.log('UID', uid);
          this.setState(prevData => {
            return {userList: [...prevData.userList, person]};
          });
          this.setState({refreshing: false});
        }
      });
  };

  renderItem = ({item}) => {
    console.log('ITEM from list chat ', item);
    return (
      <View style={{marginHorizontal: 0}}>
        <TouchableOpacity
          //   onPress={() => this.props.navigation.navigate('Chat', {item})}
          onPress={() =>
            this.props.navigation.navigate('Chat', {
              item,
            })
          }>
          <View style={styles.row}>
            <Image source={{uri: item.uri}} style={styles.pic} />
            <View>
              <View style={styles.nameContainer}>
                <Text
                  style={styles.nameTxt}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {item.fname}
                </Text>
                {item.status == 'Online' ? (
                  <View style={{flexDirection: 'row', paddingTop: 10}}>
                    <Text style={styles.on}>{item.status}</Text>
                  </View>
                ) : (
                  <View style={{flexDirection: 'row', paddingTop: 10}}></View>
                )}
              </View>
              <View style={styles.msgContainer}>
                <Text style={styles.status}>{item.about}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <Fragment>
        {/* <SafeAreaView> */}

        <TouchableHighlight
          onPress={() => this.props.navigation.navigate('Home')}
          activeOpacity={1}>
          <View
            style={{
              backgroundColor: 'white',
              height: 106,
              borderBottomWidth: 1.5,
              borderBottomColor: '#1DA1F3',
              elevation: 5,
            }}>
            <Text
              style={{
                color: '#fff',
                marginTop: 50,
                alignSelf: 'center',
                fontSize: 26,
                fontWeight: 'bold',
                letterSpacing: 0.1,
                color: '#222',
                fontFamily: 'AirbnbCerealExtraBold',
              }}>
              Chat
            </Text>

            <Icon
              name={'ios-arrow-back'}
              size={28}
              color={'#222'}
              style={{marginLeft: 0, marginTop: -32, marginLeft: 27}}
            />
          </View>
        </TouchableHighlight>
        <ScrollView>
          <View style={{marginTop: 10}}>
            {this.state.refreshing === true ? (
              <ActivityIndicator
                size="large"
                color="#05A0E4"
                style={{marginTop: 150}}
              />
            ) : (
              <FlatList
                data={this.state.userList}
                renderItem={this.renderItem}
                keyExtractor={(item, index) => index.toString()}
              />
            )}
          </View>
        </ScrollView>
        {/* </SafeAreaView> */}
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  row: {
    flexDirection: 'row',
    marginTop: 1,
    alignItems: 'center',
    borderColor: '#DCDCDC',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    padding: 10,
    paddingTop: 15,
  },
  pic: {
    left: 5,
    borderRadius: 30,
    width: 60,
    height: 60,
  },
  nameContainer: {
    left: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 280,
  },
  nameTxt: {
    marginLeft: 15,
    fontWeight: '600',
    color: '#222',
    fontSize: 18,
    width: 170,
  },
  status: {
    fontWeight: '200',
    color: '#ccc',
    fontSize: 13,
  },
  on: {
    fontWeight: '200',
    color: 'green',
    fontSize: 13,
    paddingRight: 10,
  },
  off: {
    fontWeight: '200',
    color: '#C0392B',
    fontSize: 13,
    paddingRight: 10,
  },
  msgContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
  },
  email: {
    fontWeight: '400',
    color: '#008B8B',
    fontSize: 12,
    marginLeft: 15,
  },
});
