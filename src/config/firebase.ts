import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import app from '@react-native-firebase/app';

// Note: Firebase is automatically initialized by the native modules
// when using @react-native-firebase, so we don't need to call initializeApp manually
// The configuration is loaded from google-services.json for Android
// and GoogleService-Info.plist for iOS

export {app, auth, firestore, storage};
