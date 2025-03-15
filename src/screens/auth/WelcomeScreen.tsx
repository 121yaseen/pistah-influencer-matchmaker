import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigation/types';
import {useAuth} from '../../hooks/useAuth';

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const WelcomeScreen = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const {isAuthenticated} = useAuth();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigation.navigate('Main', {screen: 'Discover'});
    }
  }, [isAuthenticated, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={{uri: 'logo'}}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>Welcome to InfluencerMatchMaker</Text>
        <Text style={styles.subtitle}>
          Connect with brands and create amazing content
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.loginButton]}
            onPress={() => navigation.navigate('Auth', {screen: 'Login'})}>
            <Text style={[styles.buttonText, styles.loginButtonText]}>
              Login
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.registerButton]}
            onPress={() =>
              navigation.navigate('Auth', {
                screen: 'Register',
                params: {userType: 'influencer'},
              })
            }>
            <Text style={[styles.buttonText, styles.registerButtonText]}>
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    width: 150,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  button: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#007AFF',
  },
  registerButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  loginButtonText: {
    color: '#ffffff',
  },
  registerButtonText: {
    color: '#007AFF',
  },
});

export default WelcomeScreen;
