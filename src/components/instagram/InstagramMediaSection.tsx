import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAuth} from '../../hooks/useAuth';
import {InfluencerProfile, InstagramPost} from '../../types';
import InstagramMediaItem from './InstagramMediaItem';
import InstagramSetupGuide from './InstagramSetupGuide';
import {
  getStoredAccessToken,
  fetchUserMedia,
  processInstagramMedia,
  updateInstagramStats,
  fetchUserProfile,
} from '../../services/instagramService';

interface InstagramMediaSectionProps {
  onRefresh?: () => void;
}

const InstagramMediaSection: React.FC<InstagramMediaSectionProps> = ({
  onRefresh,
}) => {
  const {user, profile} = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [reels, setReels] = useState<InstagramPost[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('Initializing...');
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  const isInfluencer = profile?.type === 'influencer';

  const checkAccessToken = async () => {
    try {
      const token = await getStoredAccessToken();
      setAccessToken(token);
      setDebugInfo(`Access token ${token ? 'found' : 'not found'}`);
      return token;
    } catch (error) {
      setDebugInfo(`Error checking access token: ${error}`);
      return null;
    }
  };

  const fetchInstagramMedia = async () => {
    if (!isInfluencer || !user?.uid) {
      setDebugInfo('Not an influencer account or user not authenticated');
      return;
    }

    setDebugInfo(`User ID: ${user.uid}, Profile type: ${profile?.type}`);
    if (isInfluencer) {
      setDebugInfo(
        `Instagram handle: ${(profile as InfluencerProfile).instagramHandle || 'Not set'}`,
      );
    }

    try {
      setLoading(true);
      setError(null);

      // Get access token
      const token = await checkAccessToken();
      if (!token) {
        setError('Instagram not connected');
        setDebugInfo('Instagram not connected - No access token');
        return;
      }

      setDebugInfo('Fetching user profile...');
      // Fetch user profile for follower count
      const userProfile = await fetchUserProfile(token);
      setDebugInfo(`User profile loaded: ${userProfile.username}`);

      // Fetch media
      setDebugInfo('Fetching media...');
      const media = await fetchUserMedia(token);
      setDebugInfo(`Fetched ${media.length} media items`);

      // Process media to get top posts and reels
      const {posts: topPosts, reels: topReels} = processInstagramMedia(media);
      setDebugInfo(
        `Processed ${topPosts.length} posts and ${topReels.length} reels`,
      );

      // Update state
      setPosts(topPosts);
      setReels(topReels);

      // Update Firestore with the latest stats
      await updateInstagramStats(
        user.uid,
        userProfile.media_count || 0,
        topPosts,
        topReels,
      );
      setDebugInfo('Successfully updated Instagram stats in Firestore');

      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      setError(`Failed to fetch Instagram media: ${errorMsg}`);
      setDebugInfo(`Error: ${errorMsg}`);

      // Check if the error is related to API credentials
      const errorString = String(errorMsg).toLowerCase();
      if (
        errorString.includes('client_id') ||
        errorString.includes('unauthorized') ||
        errorString.includes('authentication') ||
        errorString.includes('invalid') ||
        errorString.includes('token')
      ) {
        setShowSetupGuide(true);
      }

      Alert.alert('Error', 'Failed to fetch Instagram media');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const checkInfluencerStatus = async () => {
      if (isInfluencer) {
        const handle = (profile as InfluencerProfile).instagramHandle;
        setDebugInfo(`Checking influencer with handle: ${handle || 'not set'}`);
        if (handle) {
          const token = await checkAccessToken();
          if (!token) {
            setShowSetupGuide(true);
          } else {
            fetchInstagramMedia();
          }
        } else {
          setDebugInfo('Instagram handle not set');
        }
      } else {
        setDebugInfo('Not an influencer account');
      }
    };

    checkInfluencerStatus();
  }, [isInfluencer, profile]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchInstagramMedia();
  };

  if (!isInfluencer) {
    return (
      <View style={styles.debugContainer}>
        <Text style={styles.debugText}>Not an influencer account</Text>
        <Text style={styles.debugText}>
          Account type: {profile?.type || 'Unknown'}
        </Text>
      </View>
    );
  }

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading Instagram content...</Text>
        <Text style={styles.debugText}>{debugInfo}</Text>
      </View>
    );
  }

  if (showSetupGuide) {
    return <InstagramSetupGuide onClose={() => setShowSetupGuide(false)} />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle" size={48} color="#FF4B6A" />
        <Text style={styles.errorText}>{error}</Text>
        <View style={styles.debugInfoContainer}>
          <Text style={styles.debugText}>{debugInfo}</Text>
          <Text style={styles.debugText}>
            Token: {accessToken ? 'Present' : 'Missing'}
          </Text>
          <Text style={styles.debugText}>
            Instagram Handle:{' '}
            {isInfluencer
              ? (profile as InfluencerProfile).instagramHandle || 'Not set'
              : 'N/A'}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchInstagramMedia}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.setupButton}
            onPress={() => setShowSetupGuide(true)}>
            <Text style={styles.setupButtonText}>Setup Guide</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (reels.length === 0 && posts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="instagram" size={48} color="#E1306C" />
        <Text style={styles.emptyText}>No Instagram content to display</Text>
        <View style={styles.debugInfoContainer}>
          <Text style={styles.debugText}>{debugInfo}</Text>
          <Text style={styles.debugText}>
            Access Token: {accessToken ? 'Present' : 'Missing'}
          </Text>
          <Text style={styles.debugText}>
            Instagram Handle:{' '}
            {isInfluencer
              ? (profile as InfluencerProfile).instagramHandle || 'Not set'
              : 'N/A'}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefresh}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.setupButton}
            onPress={() => setShowSetupGuide(true)}>
            <Text style={styles.setupButtonText}>Setup Guide</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.debugInfoContainer}>
        <Text style={styles.debugText}>{debugInfo}</Text>
      </View>

      {reels.length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Top Reels</Text>
          <FlatList
            horizontal
            data={reels}
            keyExtractor={item => item.id}
            renderItem={({item}) => <InstagramMediaItem item={item} />}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.mediaList}
          />
        </View>
      )}

      {posts.length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Top Posts</Text>
          <FlatList
            horizontal
            data={posts}
            keyExtractor={item => item.id}
            renderItem={({item}) => <InstagramMediaItem item={item} />}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.mediaList}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 16,
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666666',
  },
  errorContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
  },
  errorText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  mediaList: {
    paddingHorizontal: 16,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  refreshButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  setupButton: {
    backgroundColor: '#5AC8FA',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  setupButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  debugText: {
    fontSize: 12,
    color: '#FF4B6A',
    marginTop: 4,
  },
  debugInfoContainer: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 4,
    marginVertical: 8,
  },
  debugContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
  },
});

export default InstagramMediaSection;
