import React, {Component} from 'react';
import {View, Text, StyleSheet, StatusBar, Image} from 'react-native';

// import firebase from 'firebase';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-community/async-storage';

import {GiftedChat, Bubble, Composer, Send} from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/Ionicons';
import {TouchableHighlight} from 'react-native-gesture-handler';

export default class index extends Component {
  state = {
    message: '',
    messageList: [],
    person: this.props.navigation.getParam('item'),
    status: '',
    uri: '',
    fname: '',
    uid: '',
  };

  onSend = async () => {
    // Get the users ID
    const uid = auth().currentUser.uid;
    console.log('UID THIS USER CHAT = ', uid);

    if (this.state.message.length > 0) {
      let msgId = firebase
        .database()
        .ref('messages/')
        .child(this.state.uid)
        .child(this.state.person.uid)
        .push().key;
      let updates = {};
      let message = {
        _id: msgId,
        text: this.state.message,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        user: {
          _id: this.state.uid,
          name: this.state.fname,
          avatar: this.state.uri || this.state.person.uri,
        },
      };
      updates[
        'messages/' + this.state.uid + '/' + this.state.person.uid + '/' + msgId
      ] = message;
      updates[
        'messages/' + this.state.person.uid + '/' + this.state.uid + '/' + msgId
      ] = message;
      firebase
        .database()
        .ref()
        .update(updates);
      this.setState({message: ''});
    }
  };

  componentDidMount = async () => {
    // Get the users ID
    const uid = auth().currentUser.uid;
    console.log('UID THIS USER CHAT = ', uid);
    const userId = await AsyncStorage.getItem('userId');
    const fname = await AsyncStorage.getItem('fname');
    const uri = await AsyncStorage.getItem('uri');
    this.setState({uid, fname, uri});
    // console.log('HHH', this.state.fname);
    firebase
      .database()
      .ref('messages')
      .child(this.state.uid)
      .child(this.state.person.uid)
      .on('child_added', val => {
        this.setState(previousState => ({
          messageList: GiftedChat.append(previousState.messageList, val.val()),
        }));
      });
  };

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#1DA1F3',
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 15,
          },
          left: {
            backgroundColor: '#fff',
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            borderBottomRightRadius: 15,
            borderBottomLeftRadius: 0,
          },
        }}
      />
    );
  }

  renderSend(props) {
    return (
      <Send {...props}>
        <View
          style={{
            flexDirection: 'row',
            width: 45,
            height: 44,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              height: 27,
              width: 1.6,
              right: 15,
              backgroundColor: '#E7ECF0',
            }}>
            <Text></Text>
          </View>
          <Icon
            name={'ios-send'}
            size={28}
            color={'#1DA1F3'}
            style={{transform: [{rotate: '45deg'}], right: 6}}
          />
        </View>
      </Send>
    );
  }

  render() {
    const person = this.props.navigation.getParam('data');
    console.log('PERSON', person);
    return (
      <View style={{flex: 1}}>
        <View style={styles.header}>
          <StatusBar
            translucent
            backgroundColor="#0d87d4"
            barStyle="light-content"
          />
          <>
            <TouchableHighlight onPress={() => console.log('true')}>
              <Icon
                name={'ios-arrow-back'}
                size={28}
                color={'#fff'}
                style={{
                  marginLeft: 0,
                  marginTop: 0,
                  marginLeft: 8,
                  paddingRight: 10,
                }}
              />
            </TouchableHighlight>
            <View style={styles.img}>
              <Image
                source={{uri: this.state.person.uri}} //this.state.person.uri
                style={styles.photo}
              />
            </View>
            <View style={{marginLeft: 5}}>
              <Text style={styles.heading}>{this.state.person.fname}</Text>
              {/* {this.state.person.status == 'Online' ? (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon name={'ios-disc'} size={10} color={'green'} />
                  <Text style={styles.off}>{this.state.person.status}</Text>
                </View>
              ) : (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon name={'ios-disc'} size={10} color={'#C0392B'} />
                  <Text style={styles.off}>{this.state.person.status}</Text>
                </View>
              )} */}
            </View>
          </>
        </View>

        <GiftedChat
          style={{height: 400}}
          renderBubble={this.renderBubble}
          renderSend={this.renderSend}
          text={this.state.message}
          onInputTextChanged={val => {
            this.setState({message: val});
          }}
          messages={this.state.messageList}
          onSend={() => this.onSend()}
          user={{
            _id: this.state.uid,
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  photo: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover',
  },
  img: {
    backgroundColor: 'silver',
    width: 41,
    height: 41,
    borderRadius: 50,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  heading: {
    fontFamily: 'AirbnbCerealBold',
    color: 'white',
    fontSize: 21,
    fontWeight: '700',
    width: 'auto',
  },
  header: {
    backgroundColor: '#1DA1F3',
    top: 20,
    height: 70,
    width: '100%',
    paddingHorizontal: 15,
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  off: {
    fontWeight: '200',
    color: 'whitesmoke',
    fontSize: 13,
    paddingLeft: 5,
  },
});
