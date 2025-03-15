import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import CustomIcon from '../../components/CustomIcon';
import {useAuth} from '../../hooks/useAuth';
import {Campaign, InfluencerProfile} from '../../types';
import firestore from '@react-native-firebase/firestore';

const {width, height} = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.25;
const SWIPE_OUT_DURATION = 250;

const DiscoverScreen = () => {
  const {profile} = useAuth();
  const [data, setData] = useState<Array<Campaign | InfluencerProfile>>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;
  const rotation = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [likedItems, setLikedItems] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const isInfluencer = profile?.type === 'influencer';
      const collection = isInfluencer ? 'campaigns' : 'users';

      const response = await firestore()
        .collection(collection)
        .where('status', '==', 'active')
        .limit(10)
        .get();

      const items = response.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setData(items);
    } catch (error) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [profile?.type]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({x: gesture.dx, y: gesture.dy});
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          forceSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          forceSwipe('left');
        } else {
          resetPosition();
        }
      },
    }),
  ).current;

  const forceSwipe = (direction: 'left' | 'right') => {
    const x = direction === 'right' ? width : -width;
    Animated.timing(position, {
      toValue: {x, y: 0},
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false,
    }).start(() => onSwipeComplete(direction));
  };

  const onSwipeComplete = async (direction: 'left' | 'right') => {
    const item = data[currentIndex];

    if (direction === 'right') {
      // Record the like in Firestore
      try {
        await firestore().collection('swipes').add({
          userId: profile?.id,
          targetId: item.id,
          type: 'like',
          timestamp: new Date(),
        });
        setLikedItems(prev => [...prev, item.id]);
      } catch (error) {
        setError('Failed to record swipe');
      }
    }

    position.setValue({x: 0, y: 0});
    setCurrentIndex(prevIndex => prevIndex + 1);
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: {x: 0, y: 0},
      useNativeDriver: false,
    }).start();
  };

  const getCardStyle = () => {
    const rotate = rotation;
    return {
      ...position.getLayout(),
      transform: [{rotate}],
    };
  };

  const renderCard = () => {
    if (currentIndex >= data.length) {
      return (
        <View style={styles.noMoreCards}>
          <CustomIcon name="cards" size={80} color="#999" />
          <Text style={styles.noMoreCardsText}>No more profiles</Text>
          <Text style={styles.noMoreCardsSubtext}>
            Check back later for more matches
          </Text>
        </View>
      );
    }

    const item = data[currentIndex];
    const isInfluencer = 'instagramHandle' in item;

    return (
      <Animated.View
        style={[styles.card, getCardStyle()]}
        {...panResponder.panHandlers}>
        <Image
          source={{
            uri: isInfluencer
              ? item.profilePicture
              : 'https://via.placeholder.com/400',
          }}
          style={styles.image}
        />
        <View style={styles.cardContent}>
          <Text style={styles.name}>
            {isInfluencer ? item.name : item.title}
          </Text>
          <Text style={styles.bio}>
            {isInfluencer ? item.bio : item.description}
          </Text>
          {isInfluencer ? (
            <View style={styles.stats}>
              <CustomIcon name="account-group" size={20} color="#666" />
              <Text style={styles.statsText}>
                {item.instagramStats.followers.toLocaleString()} followers
              </Text>
            </View>
          ) : (
            <View style={styles.stats}>
              <CustomIcon name="currency-usd" size={20} color="#666" />
              <Text style={styles.statsText}>
                Budget: ${item.budget.min} - ${item.budget.max}
              </Text>
            </View>
          )}
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {profile?.type === 'influencer'
            ? 'Discover Campaigns'
            : 'Discover Creators'}
        </Text>
      </View>
      <View style={styles.cardContainer}>{renderCard()}</View>
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
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    position: 'absolute',
    width: width - 40,
    height: height * 0.6,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '60%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  cardContent: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  bio: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  noMoreCards: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  noMoreCardsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 20,
    marginBottom: 8,
  },
  noMoreCardsSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default DiscoverScreen;
