import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import app from '@react-native-firebase/app';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyB8THaw-3vcd40c8tK5I8GufxzpK21Wb3s',
  authDomain: 'influencer-matchmaking.firebaseapp.com',
  projectId: 'influencer-matchmaking',
  storageBucket: 'influencer-matchmaking.firebasestorage.app',
  messagingSenderId: '92911660088',
  appId: '1:92911660088:android:3855a3192bfc30fef44acd',
};

// Note: Firebase is automatically initialized by the native modules
// when using @react-native-firebase, so we don't need to call initializeApp manually

export {app, auth, firestore, storage};
