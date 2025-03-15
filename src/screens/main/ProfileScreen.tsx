import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAuth} from '../../hooks/useAuth';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../navigation/types';

type ProfileScreenProps = {
  navigation: StackNavigationProp<MainStackParamList, 'Profile'>;
};

const ProfileScreen = ({navigation}: ProfileScreenProps) => {
  const {profile, signOut} = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isInfluencer = profile?.type === 'influencer';

  const updateProfileImage = async (imageUri: string) => {
    try {
      setLoading(true);
      const reference = storage().ref(`profile_images/${profile?.id}`);
      await reference.putFile(imageUri);
      const url = await reference.getDownloadURL();

      await firestore().collection('users').doc(profile?.id).update({
        photoURL: url,
      });
    } catch (err) {
      setError('Failed to update profile image');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    } catch (err) {
      setError('Failed to log out');
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
    }
  };

  const renderInfluencerStats = () => {
    if (!isInfluencer || !profile?.instagramStats) {
      return null;
    }

    return (
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {profile.instagramStats.followers.toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {(profile.instagramStats.engagementRate * 100).toFixed(1)}%
          </Text>
          <Text style={styles.statLabel}>Engagement</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {profile.instagramStats.recentPosts.length}
          </Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
      </View>
    );
  };

  const renderCompanyInfo = () => {
    if (isInfluencer) {
      return null;
    }

    return (
      <View style={styles.companyInfo}>
        <Text style={styles.sectionTitle}>Company Information</Text>
        <View style={styles.infoItem}>
          <Icon name="domain" size={20} color="#666" />
          <Text style={styles.infoText}>{profile?.industry}</Text>
        </View>
        <View style={styles.infoItem}>
          <Icon name="web" size={20} color="#666" />
          <Text style={styles.infoText}>{profile?.website}</Text>
        </View>
        <Text style={styles.description}>{profile?.description}</Text>
      </View>
    );
  };

  if (error) {
    Alert.alert('Error', error);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              onPress={handleImagePick}
              style={styles.profileImageContainer}>
              {profile?.profileImage ? (
                <Image
                  source={{
                    uri:
                      typeof profile.profileImage === 'string'
                        ? profile.profileImage
                        : '',
                  }}
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
            {isInfluencer && (
              <Text style={styles.handle}>@{profile?.instagramHandle}</Text>
            )}
          </View>
        </View>

        {renderInfluencerStats()}
        {renderCompanyInfo()}

        <View style={styles.menuSection}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('EditProfile')}>
            <Icon name="account-edit" size={24} color="#666" />
            <Text style={styles.menuText}>Edit Profile</Text>
            <Icon name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>

          {!isInfluencer && (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() =>
                navigation.navigate('Main', {screen: 'CampaignManagement'})
              }>
              <Icon name="bullhorn" size={24} color="#666" />
              <Text style={styles.menuText}>Manage Campaigns</Text>
              <Icon name="chevron-right" size={24} color="#999" />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Settings')}>
            <Icon name="cog" size={24} color="#666" />
            <Text style={styles.menuText}>Settings</Text>
            <Icon name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.signOutButton} onPress={handleLogout}>
            <Icon name="logout" size={24} color="#FF4B6A" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
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
    marginBottom: 4,
  },
  handle: {
    fontSize: 16,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#F0F0F0',
  },
  companyInfo: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    lineHeight: 24,
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    marginTop: 12,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    marginLeft: 12,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  signOutText: {
    fontSize: 16,
    color: '#FF4B6A',
    marginLeft: 12,
  },
});

export default ProfileScreen;
