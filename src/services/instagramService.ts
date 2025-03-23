import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  INSTAGRAM_API_BASE_URL,
  INSTAGRAM_TOKEN_URL,
  INSTAGRAM_CLIENT_ID,
  INSTAGRAM_CLIENT_SECRET,
  INSTAGRAM_REDIRECT_URI,
} from '../config/instagram';
import firestore from '@react-native-firebase/firestore';
import {InstagramPost} from '../types';

// Storage keys
const INSTAGRAM_ACCESS_TOKEN = 'instagram_access_token';
const INSTAGRAM_USER_ID = 'instagram_user_id';

/**
 * Exchange authorization code for access token
 */
export const getAccessToken = async (code: string): Promise<string> => {
  try {
    const response = await axios.post(INSTAGRAM_TOKEN_URL, null, {
      params: {
        client_id: INSTAGRAM_CLIENT_ID,
        client_secret: INSTAGRAM_CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: INSTAGRAM_REDIRECT_URI,
        code,
      },
    });

    if (response.data && response.data.access_token) {
      await AsyncStorage.setItem(
        INSTAGRAM_ACCESS_TOKEN,
        response.data.access_token,
      );
      await AsyncStorage.setItem(INSTAGRAM_USER_ID, response.data.user_id);
      return response.data.access_token;
    }

    throw new Error('Failed to get access token from Instagram');
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    throw error;
  }
};

/**
 * Get the stored Instagram access token
 */
export const getStoredAccessToken = async (): Promise<string | null> => {
  return AsyncStorage.getItem(INSTAGRAM_ACCESS_TOKEN);
};

/**
 * Get the stored Instagram user ID
 */
export const getStoredUserId = async (): Promise<string | null> => {
  return AsyncStorage.getItem(INSTAGRAM_USER_ID);
};

/**
 * Save Instagram handle to user profile
 */
export const saveInstagramHandle = async (
  userId: string,
  instagramHandle: string,
): Promise<void> => {
  try {
    await firestore().collection('users').doc(userId).update({
      instagramHandle,
    });
  } catch (error) {
    console.error('Error saving Instagram handle:', error);
    throw error;
  }
};

/**
 * Get user's Instagram profile
 */
export const fetchUserProfile = async (
  accessToken: string,
): Promise<{id: string; username: string; media_count: number}> => {
  try {
    const response = await axios.get(`${INSTAGRAM_API_BASE_URL}/me`, {
      params: {
        fields: 'id,username,media_count',
        access_token: accessToken,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Instagram profile:', error);
    throw error;
  }
};

/**
 * Get user's media (posts and reels)
 */
export const fetchUserMedia = async (
  accessToken: string,
  limit: number = 30,
): Promise<any[]> => {
  try {
    const userId = await getStoredUserId();
    const response = await axios.get(
      `${INSTAGRAM_API_BASE_URL}/${userId}/media`,
      {
        params: {
          fields:
            'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count',
          access_token: accessToken,
          limit,
        },
      },
    );
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching Instagram media:', error);
    throw error;
  }
};

/**
 * Process media to separate posts and reels
 */
export const processInstagramMedia = (
  media: any[],
): {posts: InstagramPost[]; reels: InstagramPost[]} => {
  const posts: InstagramPost[] = [];
  const reels: InstagramPost[] = [];

  media.forEach(item => {
    const post: InstagramPost = {
      id: item.id,
      type: item.media_type === 'VIDEO' ? 'REEL' : 'POST',
      mediaUrl: item.media_url || item.thumbnail_url,
      caption: item.caption || '',
      likes: item.like_count || 0,
      comments: item.comments_count || 0,
      timestamp: new Date(item.timestamp),
    };

    if (item.media_type === 'VIDEO') {
      reels.push(post);
    } else {
      posts.push(post);
    }
  });

  // Sort by engagement (likes + comments)
  const sortByEngagement = (a: InstagramPost, b: InstagramPost) =>
    b.likes + b.comments - (a.likes + a.comments);

  posts.sort(sortByEngagement);
  reels.sort(sortByEngagement);

  return {
    posts: posts.slice(0, 3), // Top 3 posts
    reels: reels.slice(0, 3), // Top 3 reels
  };
};

/**
 * Update user's Instagram stats in Firestore
 */
export const updateInstagramStats = async (
  userId: string,
  followerCount: number,
  posts: InstagramPost[],
  reels: InstagramPost[],
): Promise<void> => {
  try {
    // Calculate engagement rate as avg likes+comments / follower count
    const allMedia = [...posts, ...reels];
    let totalEngagement = 0;

    allMedia.forEach(item => {
      totalEngagement += item.likes + item.comments;
    });

    const engagementRate =
      allMedia.length > 0
        ? totalEngagement / allMedia.length / followerCount
        : 0;

    // Update Firestore
    await firestore()
      .collection('users')
      .doc(userId)
      .update({
        instagramStats: {
          followers: followerCount,
          engagementRate,
          recentPosts: allMedia,
        },
      });
  } catch (error) {
    console.error('Error updating Instagram stats:', error);
    throw error;
  }
};
