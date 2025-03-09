import React, { useState } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthScreenProps } from '../../navigation/types';
import { useAuth } from '../../hooks/useAuth';

const RegisterScreen = ({ navigation, route }: AuthScreenProps<'Register'>) => {
  const { userType } = route.params;
  const { signUp } = useAuth();
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

    if (userType === 'company' && (!companyName || !website || !industry)) {
      Alert.alert('Error', 'Please fill in all company information');
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
              niches: [],
              location: '',
              demographics: {
                age: '',
                gender: '',
                primaryAudience: [],
              },
            }
          : {
              name,
              companyName,
              website,
              industry,
              description: '',
              campaigns: [],
            };

      await signUp(email, password, userType, userData);
      // After successful registration, navigate to Instagram auth for influencers
      if (userType === 'influencer') {
        navigation.navigate('InstagramAuth');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {userType === 'influencer'
                ? 'Creator Sign Up'
                : 'Business Sign Up'}
            </Text>
            <Text style={styles.subtitle}>
              {userType === 'influencer'
                ? 'Start collaborating with brands'
                : 'Find the perfect influencers'}
            </Text>
          </View>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#999"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
            />

            {userType === 'influencer' ? (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Instagram Handle"
                  placeholderTextColor="#999"
                  autoCapitalize="none"
                  value={instagramHandle}
                  onChangeText={setInstagramHandle}
                />

                <TextInput
                  style={[styles.input, styles.bioInput]}
                  placeholder="Bio (optional)"
                  placeholderTextColor="#999"
                  multiline
                  value={bio}
                  onChangeText={setBio}
                />
              </>
            ) : (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Company Name"
                  placeholderTextColor="#999"
                  value={companyName}
                  onChangeText={setCompanyName}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Website"
                  placeholderTextColor="#999"
                  autoCapitalize="none"
                  keyboardType="url"
                  value={website}
                  onChangeText={setWebsite}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Industry"
                  placeholderTextColor="#999"
                  value={industry}
                  onChangeText={setIndustry}
                />
              </>
            )}

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </TouchableOpacity>
          </View>

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
  content: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    padding: 20,
  },
  input: {
    height: 56,
    backgroundColor: '#F5F5F5',
    borderRadius: 28,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#000',
    marginBottom: 16,
  },
  bioInput: {
    height: 120,
    paddingTop: 16,
    paddingBottom: 16,
    textAlignVertical: 'top',
  },
  button: {
    height: 56,
    backgroundColor: '#FF4B6A',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  footerLink: {
    color: '#FF4B6A',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default RegisterScreen;
