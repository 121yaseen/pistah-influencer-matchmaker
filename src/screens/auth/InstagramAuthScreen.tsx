import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import WebView, {WebViewNavigation} from 'react-native-webview';
import {AuthScreenProps} from '../../navigation/types';
import {
  INSTAGRAM_CLIENT_ID,
  INSTAGRAM_REDIRECT_URI,
} from '../../config/instagram';

const InstagramAuthScreen = ({
  navigation,
}: AuthScreenProps<'InstagramAuth'>) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInstagramAuth = async (code: string) => {
    try {
      setLoading(true);
      // Handle Instagram authentication here
      // This is where you would exchange the code for an access token
      // and store the user's Instagram credentials
      navigation.replace('Main');
    } catch (error) {
      setError('Failed to authenticate with Instagram');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    if (navState.url.includes('error=access_denied')) {
      // User denied access
      setError('Access denied by user');
      navigation.goBack();
    } else if (navState.url.includes(INSTAGRAM_REDIRECT_URI)) {
      const code = navState.url.split('code=')[1]?.split('&')[0];
      if (code) {
        handleInstagramAuth(code);
      } else {
        setError('Failed to get authorization code');
        navigation.goBack();
      }
    }
  };

  const instagramAuthURL = `https://api.instagram.com/oauth/authorize?client_id=${INSTAGRAM_CLIENT_ID}&redirect_uri=${INSTAGRAM_REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Connecting to Instagram...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    Alert.alert('Error', error);
  }

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{uri: instagramAuthURL}}
        onNavigationStateChange={handleNavigationStateChange}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.webviewLoader}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  webviewLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});

export default InstagramAuthScreen;
