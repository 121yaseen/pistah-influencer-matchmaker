import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {InstagramPost} from '../../types';

interface InstagramMediaItemProps {
  item: InstagramPost;
  onPress?: () => void;
}

const {width} = Dimensions.get('window');
const CARD_WIDTH = width / 2 - 24; // 2 columns with margins

const InstagramMediaItem: React.FC<InstagramMediaItemProps> = ({
  item,
  onPress,
}) => {
  const formattedLikes =
    item.likes > 999
      ? `${(item.likes / 1000).toFixed(1)}K`
      : item.likes.toString();

  const formattedComments =
    item.comments > 999
      ? `${(item.comments / 1000).toFixed(1)}K`
      : item.comments.toString();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        <Image
          source={{uri: item.mediaUrl}}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.typeIndicator}>
          <Icon
            name={item.type === 'REEL' ? 'play-circle' : 'image'}
            size={16}
            color="#FFFFFF"
          />
        </View>
      </View>

      <View style={styles.captionContainer}>
        <Text numberOfLines={2} ellipsizeMode="tail" style={styles.caption}>
          {item.caption || 'No caption'}
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Icon name="heart" size={14} color="#FF4B6A" />
          <Text style={styles.statText}>{formattedLikes}</Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="comment" size={14} color="#666666" />
          <Text style={styles.statText}>{formattedComments}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: CARD_WIDTH,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  typeIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captionContainer: {
    padding: 10,
    minHeight: 50,
  },
  caption: {
    fontSize: 12,
    color: '#333333',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666666',
  },
});

export default InstagramMediaItem;
