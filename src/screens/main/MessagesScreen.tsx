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
import {Match, Message, InfluencerProfile, CompanyProfile} from '../../types';
import firestore from '@react-native-firebase/firestore';
import {format} from 'date-fns';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '@navigation/types';

interface ChatItem extends Match {
  lastMessage: Message;
  matchedProfile: InfluencerProfile | CompanyProfile;
  unreadCount: number;
}

type MessagesScreenProps = {
  navigation: StackNavigationProp<MainStackParamList, 'Messages'>;
};

const MessagesScreen: React.FC<MessagesScreenProps> = ({navigation}) => {
  const {profile} = useAuth();
  const [chats, setChats] = useState<ChatItem[]>([]);
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
        .where('status', '==', 'accepted')
        .onSnapshot(async snapshot => {
          const matchesData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })) as Match[];

          // Fetch matched profiles and last messages
          const chatsData = await Promise.all(
            matchesData.map(async match => {
              const targetId =
                profile.type === 'influencer'
                  ? match.companyId
                  : match.influencerId;

              // Get matched profile
              const targetDoc = await firestore()
                .collection('users')
                .doc(targetId)
                .get();

              // Get last message
              const messagesSnapshot = await firestore()
                .collection('messages')
                .where('matchId', '==', match.id)
                .orderBy('timestamp', 'desc')
                .limit(1)
                .get();

              // Get unread count
              const unreadSnapshot = await firestore()
                .collection('messages')
                .where('matchId', '==', match.id)
                .where('senderId', '!=', profile.id)
                .where('read', '==', false)
                .get();

              const lastMessage = messagesSnapshot.docs[0]?.data() as Message;

              return {
                ...match,
                lastMessage,
                matchedProfile: {
                  id: targetDoc.id,
                  ...targetDoc.data(),
                } as InfluencerProfile | CompanyProfile,
                unreadCount: unreadSnapshot.size,
              };
            }),
          );

          setChats(chatsData.filter(chat => chat.lastMessage));
          setLoading(false);
        });

      return () => unsubscribe();
    }
  }, [profile]);

  const renderChatItem = ({item}: {item: ChatItem}) => {
    const {matchedProfile, lastMessage, unreadCount} = item;
    const isInfluencer = 'instagramHandle' in matchedProfile;

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() =>
          navigation.navigate('ChatRoom', {
            matchId: item.id,
            recipientId: matchedProfile.id,
          })
        }>
        <Image
          source={{
            uri:
              matchedProfile.profilePicture ||
              'https://via.placeholder.com/100',
          }}
          style={styles.profileImage}
        />
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
        <View style={styles.chatInfo}>
          <Text style={styles.name}>
            {isInfluencer ? matchedProfile.name : matchedProfile.companyName}
          </Text>
          <Text
            style={[
              styles.lastMessage,
              unreadCount > 0 && styles.unreadMessage,
            ]}
            numberOfLines={1}>
            {lastMessage.content}
          </Text>
        </View>
        <Text style={styles.time}>
          {format(lastMessage.timestamp.toDate(), 'HH:mm')}
        </Text>
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
        <Text style={styles.headerTitle}>Messages</Text>
      </View>
      {chats.length > 0 ? (
        <FlatList
          data={chats}
          renderItem={renderChatItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyState}>
          <Icon name="message-text" size={80} color="#999" />
          <Text style={styles.emptyStateText}>No messages yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Start chatting with your matches
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
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  badge: {
    position: 'absolute',
    left: 50,
    top: 12,
    backgroundColor: '#FF4B6A',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  chatInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
  unreadMessage: {
    color: '#000',
    fontWeight: '500',
  },
  time: {
    fontSize: 12,
    color: '#999',
    marginLeft: 8,
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

export default MessagesScreen;
