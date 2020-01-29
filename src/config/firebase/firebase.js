import firebase from 'firebase';

var config = {
  databaseURL: 'https://friendschat-ca44c.firebaseio.com/',
  projectId: 'friendschat-ca44c',
};

// firebase.initializeApp(config);

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export default firebase;
