import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface InstagramSetupGuideProps {
  onClose?: () => void;
}

const InstagramSetupGuide: React.FC<InstagramSetupGuideProps> = ({onClose}) => {
  const handleOpenDeveloperPortal = () => {
    Linking.openURL('https://developers.facebook.com/');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Instagram Integration Setup</Text>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close" size={24} color="#666666" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.subtitle}>
          Follow these steps to enable Instagram integration:
        </Text>

        <View style={styles.stepContainer}>
          <View style={styles.stepNumberContainer}>
            <Text style={styles.stepNumber}>1</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>
              Create a Facebook Developer Account
            </Text>
            <Text style={styles.stepDescription}>
              Sign up for a Facebook Developer account if you don't already have
              one.
            </Text>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={handleOpenDeveloperPortal}>
              <Text style={styles.linkButtonText}>Open Developer Portal</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.stepContainer}>
          <View style={styles.stepNumberContainer}>
            <Text style={styles.stepNumber}>2</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Create a Facebook App</Text>
            <Text style={styles.stepDescription}>
              Create a new app in the Facebook Developer Portal. Select
              "Consumer" as the app type.
            </Text>
          </View>
        </View>

        <View style={styles.stepContainer}>
          <View style={styles.stepNumberContainer}>
            <Text style={styles.stepNumber}>3</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Set Up Instagram Basic Display</Text>
            <Text style={styles.stepDescription}>
              In your app dashboard, add the "Instagram Basic Display" product.
              Follow the setup instructions.
            </Text>
          </View>
        </View>

        <View style={styles.stepContainer}>
          <View style={styles.stepNumberContainer}>
            <Text style={styles.stepNumber}>4</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Configure App Settings</Text>
            <Text style={styles.stepDescription}>
              Configure your app settings with the following:
            </Text>
            <View style={styles.codeBlock}>
              <Text style={styles.codeText}>
                Valid OAuth Redirect URIs:{'\n'}
                YOUR_APP_SCHEME://instagram-auth{'\n\n'}
                Deauthorize Callback URL:{'\n'}
                https://your-app-domain.com/deauthorize{'\n\n'}
                Data Deletion Request URL:{'\n'}
                https://your-app-domain.com/delete-data
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.stepContainer}>
          <View style={styles.stepNumberContainer}>
            <Text style={styles.stepNumber}>5</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Get App Credentials</Text>
            <Text style={styles.stepDescription}>
              Collect your App ID and App Secret from the Basic Settings page.
            </Text>
          </View>
        </View>

        <View style={styles.stepContainer}>
          <View style={styles.stepNumberContainer}>
            <Text style={styles.stepNumber}>6</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Update Config in App</Text>
            <Text style={styles.stepDescription}>
              Update the Instagram config file in the app with your credentials:
            </Text>
            <View style={styles.codeBlock}>
              <Text style={styles.codeText}>
                File: src/config/instagram.ts{'\n\n'}
                INSTAGRAM_CLIENT_ID = 'YOUR_APP_ID'{'\n'}
                INSTAGRAM_CLIENT_SECRET = 'YOUR_APP_SECRET'{'\n'}
                INSTAGRAM_REDIRECT_URI = 'YOUR_APP_SCHEME://instagram-auth'
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.stepContainer}>
          <View style={styles.stepNumberContainer}>
            <Text style={styles.stepNumber}>7</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Rebuild and Run the App</Text>
            <Text style={styles.stepDescription}>
              Rebuild and run the app to apply the changes. Now the Instagram
              integration should work correctly.
            </Text>
          </View>
        </View>

        <Text style={styles.note}>
          Note: For production use, you'll need to submit your app for Instagram
          App Review to obtain permission to access public data of Instagram
          users.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 16,
    maxHeight: 400,
  },
  subtitle: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 16,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  stepNumberContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  codeBlock: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#333333',
  },
  linkButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  linkButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  note: {
    fontSize: 14,
    color: '#666666',
    marginTop: 16,
    fontStyle: 'italic',
  },
});

export default InstagramSetupGuide;
