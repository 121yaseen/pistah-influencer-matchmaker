import React, {createContext, useContext, useState, useEffect} from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {InfluencerProfile, CompanyProfile} from '../types';

interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  profile: InfluencerProfile | CompanyProfile | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<FirebaseAuthTypes.UserCredential>;
  signUp: (
    email: string,
    password: string,
    userType: 'influencer' | 'company',
    userData: Partial<InfluencerProfile | CompanyProfile>,
  ) => Promise<FirebaseAuthTypes.UserCredential>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export {AuthContext};

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [profile, setProfile] = useState<
    InfluencerProfile | CompanyProfile | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeAuth = auth().onAuthStateChanged(async currentUser => {
      setUser(currentUser);

      if (currentUser) {
        // Fetch user profile from Firestore
        const unsubscribeProfile = firestore()
          .collection('users')
          .doc(currentUser.uid)
          .onSnapshot(doc => {
            if (doc.exists) {
              setProfile(doc.data() as InfluencerProfile | CompanyProfile);
            }
            setLoading(false);
          });

        return () => unsubscribeProfile();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      setUser(userCredential.user);
      return userCredential;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to sign in';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (
    email: string,
    password: string,
    userType: 'influencer' | 'company',
    userData: Partial<InfluencerProfile | CompanyProfile>,
  ) => {
    try {
      setLoading(true);
      setError(null);
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );

      // Create user profile in Firestore
      await firestore()
        .collection('users')
        .doc(userCredential.user.uid)
        .set({
          ...userData,
          type: userType,
          id: userCredential.user.uid,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });

      setUser(userCredential.user);
      return userCredential;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to sign up';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      return await auth().signOut();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to sign out';
      setError(errorMessage);
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      return await auth().sendPasswordResetEmail(email);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to reset password';
      setError(errorMessage);
      throw err;
    }
  };

  const value = {
    user,
    profile,
    loading,
    error,
    isAuthenticated: !!user,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
