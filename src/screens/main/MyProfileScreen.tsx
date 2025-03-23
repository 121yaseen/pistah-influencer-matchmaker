import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {useAuth} from '../../hooks/useAuth';
import {MainStackParamList} from '../../navigation/types';
import InstagramHandleInput from '../../components/instagram/InstagramHandleInput';
import InstagramMediaSection from '../../components/instagram/InstagramMediaSection';
import InstagramSetupGuide from '../../components/instagram/InstagramSetupGuide';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import {InfluencerProfile} from '../../types';
import {getStoredAccessToken} from '../../services/instagramService';

type MyProfileScreenProps = {
  navigation: StackNavigationProp<MainStackParamList, 'MyProfile'>;
};

const MyProfileScreen: React.FC<MyProfileScreenProps> = ({navigation}) => {
  const {user, profile} = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [instagramConfigured, setInstagramConfigured] = useState<
    boolean | null
  >(null);

  const isInfluencer = profile?.type === 'influencer';

  const checkInstagramConfig = async () => {
    try {
      const token = await getStoredAccessToken();
      setInstagramConfigured(!!token);
    } catch (error) {
      setInstagramConfigured(false);
    }
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    checkInstagramConfig();
    // This will be handled by child components that implement their own refresh logic
    setRefreshing(false);
  }, []);

  React.useEffect(() => {
    checkInstagramConfig();
  }, []);

  const updateProfileImage = async (imageUri: string) => {
    try {
      setLoading(true);
      const reference = storage().ref(`profile_images/${user?.uid}`);
      await reference.putFile(imageUri);
      const url = await reference.getDownloadURL();

      await firestore().collection('users').doc(user?.uid).update({
        profilePicture: url,
      });
    } catch (err) {
      setError('Failed to update profile image');
      Alert.alert('Error', 'Failed to update profile image');
    } finally {
      setLoading(false);
    }
  };

  const handleImagePick = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
      });

      if (result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        if (imageUri) {
          await updateProfileImage(imageUri);
        }
      }
    } catch (err) {
      setError('Failed to pick image');
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const renderInfluencerStats = () => {
    if (!isInfluencer || !(profile as InfluencerProfile).instagramStats) {
      return null;
    }

    const stats = (profile as InfluencerProfile).instagramStats;

    return (
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {stats.followers.toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {(stats.engagementRate * 100).toFixed(1)}%
          </Text>
          <Text style={styles.statLabel}>Engagement</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.recentPosts.length}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
      </View>
    );
  };

  const handleInstagramSubmit = () => {
    handleRefresh();
  };

  if (showSetupGuide) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <InstagramSetupGuide onClose={() => setShowSetupGuide(false)} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              onPress={handleImagePick}
              style={styles.profileImageContainer}
              disabled={loading}>
              {profile?.profilePicture ? (
                <Image
                  source={{uri: profile.profilePicture}}
                  style={styles.profileImage}
                />
              ) : (
                <Icon name="account-circle" size={100} color="#999999" />
              )}
              <View style={styles.editIconContainer}>
                <Icon name="pencil" size={16} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
            <Text style={styles.name}>
              {isInfluencer ? profile?.name : profile?.companyName}
            </Text>
            {isInfluencer && (profile as InfluencerProfile).instagramHandle && (
              <Text style={styles.handle}>
                @{(profile as InfluencerProfile).instagramHandle}
              </Text>
            )}

            {/* Debug text to show user type */}
            <Text style={styles.debugText}>
              Account type: {profile?.type || 'Unknown'}
            </Text>
          </View>
        </View>

        {renderInfluencerStats()}

        {/* Content Sections */}
        <View style={styles.contentContainer}>
          {/* Instagram Setup Note */}
          {isInfluencer && instagramConfigured === false && (
            <View style={styles.setupContainer}>
              <Icon name="instagram" size={32} color="#E1306C" />
              <Text style={styles.setupTitle}>
                Instagram Integration Not Configured
              </Text>
              <Text style={styles.setupDescription}>
                Instagram integration requires setup in the app code. Follow our
                guide to enable this feature.
              </Text>
              <TouchableOpacity
                style={styles.setupButton}
                onPress={() => setShowSetupGuide(true)}>
                <Text style={styles.setupButtonText}>View Setup Guide</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Instagram Handle Input (for influencers only) */}
          {isInfluencer ? (
            <InstagramHandleInput onSubmit={handleInstagramSubmit} />
          ) : (
            <View style={styles.debugCard}>
              <Text style={styles.debugText}>
                Instagram section is only visible for influencer accounts.
              </Text>
              <Text style={styles.debugText}>
                Current account type: {profile?.type || 'Unknown'}
              </Text>
            </View>
          )}

          {/* Instagram Media Section (for influencers only) */}
          {isInfluencer && <InstagramMediaSection onRefresh={handleRefresh} />}

          {/* Navigation Menu */}
          <View style={styles.menuSection}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('EditProfile')}>
              <Icon name="account-edit" size={24} color="#666" />
              <Text style={styles.menuText}>Edit Profile</Text>
              <Icon name="chevron-right" size={24} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('Settings')}>
              <Icon name="cog" size={24} color="#666" />
              <Text style={styles.menuText}>Settings</Text>
              <Icon name="chevron-right" size={24} color="#999" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerContent: {
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIconContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  handle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#EEEEEE',
  },
  contentContainer: {
    padding: 16,
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    color: '#333',
  },
  debugText: {
    fontSize: 14,
    color: '#FF4B6A',
    marginTop: 4,
  },
  debugCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  setupContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  setupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 12,
    marginBottom: 8,
  },
  setupDescription: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 16,
  },
  setupButton: {
    backgroundColor: '#E1306C',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  setupButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

export default MyProfileScreen;
