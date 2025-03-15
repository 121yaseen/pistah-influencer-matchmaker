import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import app from '@react-native-firebase/app';

// Firebase is automatically initialized by the native modules
// No need to call initializeApp manually when using @react-native-firebase

export {app, auth, firestore, storage};
