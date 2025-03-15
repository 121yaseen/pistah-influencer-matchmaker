import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AuthScreenProps} from '../../navigation/types';
import {useAuth} from '../../hooks/useAuth';
import {CommonActions} from '@react-navigation/native';

const RegisterScreen = ({navigation, route}: AuthScreenProps<'Register'>) => {
  const {userType} = route.params;
  const {signUp} = useAuth();
  const [loading, setLoading] = useState(false);

  // Common fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');

  // Influencer specific fields
  const [instagramHandle, setInstagramHandle] = useState('');
  const [bio, setBio] = useState('');

  // Company specific fields
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('');

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword || !name) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (userType === 'influencer' && !instagramHandle) {
      Alert.alert('Error', 'Please enter your Instagram handle');
      return;
    }

    if (userType === 'company' && !companyName) {
      Alert.alert('Error', 'Please enter your company name');
      return;
    }

    try {
      setLoading(true);
      const userData =
        userType === 'influencer'
          ? {
              name,
              instagramHandle,
              bio,
            }
          : {
              name,
              companyName,
              website,
              industry,
            };

      await signUp(email, password, userType, userData);

      // After successful registration, navigate to Instagram auth for influencers
      if (userType === 'influencer') {
        navigation.navigate('InstagramAuth');
      } else {
        // For companies, navigate to the main app
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Welcome'}],
          }),
        );
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to register';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingView}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.logoContainer}>
            <Image
              source={{uri: 'logo'}}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>
            {userType === 'influencer'
              ? 'Register as Influencer'
              : 'Register as Company'}
          </Text>

          {/* Rest of your form components */}

          {/* Common Fields */}
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          {/* Influencer specific fields */}
          {userType === 'influencer' && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Instagram Handle"
                value={instagramHandle}
                onChangeText={setInstagramHandle}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Bio"
                multiline
                numberOfLines={4}
                value={bio}
                onChangeText={setBio}
              />
            </>
          )}

          {/* Company specific fields */}
          {userType === 'company' && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Company Name"
                value={companyName}
                onChangeText={setCompanyName}
              />
              <TextInput
                style={styles.input}
                placeholder="Website"
                keyboardType="url"
                autoCapitalize="none"
                value={website}
                onChangeText={setWebsite}
              />
              <TextInput
                style={styles.input}
                placeholder="Industry"
                value={industry}
                onChangeText={setIndustry}
              />
            </>
          )}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Register</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}>Log In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  button: {
    height: 50,
    backgroundColor: '#FF4B6A',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#666',
  },
  footerLink: {
    color: '#FF4B6A',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
