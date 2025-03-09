import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAuth} from '../../hooks/useAuth';
import {Match, InfluencerProfile, CompanyProfile} from '../../types';
import firestore from '@react-native-firebase/firestore';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '@navigation/types';

interface MatchItem extends Match {
  matchedProfile: InfluencerProfile | CompanyProfile;
}

type MatchesScreenProps = {
  navigation: StackNavigationProp<MainStackParamList, 'Matches'>;
};

const MatchesScreen: React.FC<MatchesScreenProps> = ({navigation}) => {
  const {profile} = useAuth();
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.id) {
      const unsubscribe = firestore()
        .collection('matches')
        .where(
          profile.type === 'influencer' ? 'influencerId' : 'companyId',
          '==',
          profile.id,
        )
        .onSnapshot(async snapshot => {
          const matchesData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })) as Match[];

          // Fetch matched profiles
          const matchedProfiles = await Promise.all(
            matchesData.map(async match => {
              const targetId =
                profile.type === 'influencer'
                  ? match.companyId
                  : match.influencerId;
              const targetDoc = await firestore()
                .collection('users')
                .doc(targetId)
                .get();

              return {
                ...match,
                matchedProfile: {
                  id: targetDoc.id,
                  ...targetDoc.data(),
                } as InfluencerProfile | CompanyProfile,
              };
            }),
          );

          setMatches(matchedProfiles);
          setLoading(false);
        });

      return () => unsubscribe();
    }
  }, [profile]);

  const renderMatchItem = ({item}: {item: MatchItem}) => {
    const {matchedProfile} = item;
    const isInfluencer = 'instagramHandle' in matchedProfile;

    return (
      <TouchableOpacity
        style={styles.matchItem}
        onPress={() => navigation.navigate('MatchDetails', {matchId: item.id})}>
        <Image
          source={{
            uri:
              matchedProfile.profilePicture ||
              'https://via.placeholder.com/100',
          }}
          style={styles.profileImage}
        />
        <View style={styles.matchInfo}>
          <Text style={styles.name}>
            {isInfluencer ? matchedProfile.name : matchedProfile.companyName}
          </Text>
          <Text style={styles.subtitle}>
            {isInfluencer
              ? `${matchedProfile.instagramStats.followers.toLocaleString()} followers`
              : matchedProfile.industry}
          </Text>
          <Text style={styles.status}>
            {item.status === 'pending' ? 'Waiting for response' : item.status}
          </Text>
        </View>
        <Icon name="chevron-right" size={24} color="#999" />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4B6A" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Matches</Text>
      </View>
      {matches.length > 0 ? (
        <FlatList
          data={matches}
          renderItem={renderMatchItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyState}>
          <Icon name="account-multiple" size={80} color="#999" />
          <Text style={styles.emptyStateText}>No matches yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Keep swiping to find your perfect match
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 20,
  },
  matchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  matchInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  status: {
    fontSize: 12,
    color: '#FF4B6A',
    textTransform: 'capitalize',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default MatchesScreen;
