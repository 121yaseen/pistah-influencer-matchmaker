import { Alert } from "react-native";
import Constants from "expo-constants";

// Instagram Graph API Configuration
const INSTAGRAM_CONFIG = {
  // Get values from Constants
  clientId: Constants.expoConfig?.extra?.INSTAGRAM_APP_ID,
  clientSecret: Constants.expoConfig?.extra?.INSTAGRAM_APP_SECRET,
  redirectUri: Constants.expoConfig?.extra?.INSTAGRAM_REDIRECT_URI,
  // Instagram API endpoints
  apiBaseUrl: "https://graph.facebook.com/v19.0",
  oauthUrl: "https://graph.facebook.com/v19.0/oauth/access_token",
};

/**
 * Exchange authorization code for an access token
 * In a real app, this would be done on your backend for security
 */
export const exchangeCodeForToken = async (
  code: string
): Promise<string | null> => {
  try {
    console.log("Exchanging code for token (mock implementation)");

    // For demo purposes, we'll just return the code as if it were a token
    // In a real app, you would make an API call to exchange the code for a token
    await new Promise((resolve) => setTimeout(resolve, 500));
    return code;
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    return null;
  }
};

// Types
export interface InstagramProfile {
  username: string;
  full_name: string;
  biography: string;
  profile_picture_url: string;
  followers_count: number;
  media_count: number;
}

export interface InstagramMedia {
  id: string;
  media_type: string; // IMAGE, VIDEO, CAROUSEL_ALBUM
  media_url: string;
  permalink: string;
  thumbnail_url?: string;
  caption?: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
}

// Helper function to get Instagram Business Account ID
async function getInstagramBusinessAccountId(token: string): Promise<string> {
  try {
    // First, get the user's Facebook Pages
    const pagesResponse = await fetch(
      `${INSTAGRAM_CONFIG.apiBaseUrl}/me/accounts?access_token=${token}`
    );
    const pagesData = await pagesResponse.json();

    if (!pagesData?.data?.[0]?.id) {
      throw new Error(
        "No Facebook Page found. Please make sure you have a Facebook Page connected to your account."
      );
    }

    const pageId = pagesData.data[0].id;
    const pageAccessToken = pagesData.data[0].access_token;

    // Then, get the Instagram Business Account connected to the Page
    const igResponse = await fetch(
      `${INSTAGRAM_CONFIG.apiBaseUrl}/${pageId}?fields=instagram_business_account&access_token=${pageAccessToken}`
    );
    const igData = await igResponse.json();

    if (!igData?.instagram_business_account?.id) {
      throw new Error(
        "No Instagram Business Account found. Please make sure your Instagram account is connected to your Facebook Page."
      );
    }

    return igData.instagram_business_account.id;
  } catch (error) {
    console.error("Error getting Instagram Business Account ID:", error);
    throw error;
  }
}

// Fetch Instagram user data
export const fetchInstagramProfile = async (
  token: string
): Promise<InstagramProfile | null> => {
  try {
    const igAccountId = await getInstagramBusinessAccountId(token);

    // Fetch the Instagram Business Account details
    const response = await fetch(
      `${INSTAGRAM_CONFIG.apiBaseUrl}/${igAccountId}?fields=username,name,biography,profile_picture_url,followers_count,media_count&access_token=${token}`
    );
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    return {
      username: data.username,
      full_name: data.name,
      biography: data.biography,
      profile_picture_url: data.profile_picture_url,
      followers_count: data.followers_count,
      media_count: data.media_count,
    };
  } catch (error) {
    console.error("Error fetching Instagram profile:", error);
    return null;
  }
};

// Fetch Instagram posts
export const fetchInstagramPosts = async (
  token: string,
  limit: number = 6
): Promise<InstagramMedia[]> => {
  try {
    const igAccountId = await getInstagramBusinessAccountId(token);

    // Fetch the media items
    const response = await fetch(
      `${INSTAGRAM_CONFIG.apiBaseUrl}/${igAccountId}/media?fields=id,media_type,media_url,permalink,thumbnail_url,caption,timestamp,like_count,comments_count&limit=${limit}&access_token=${token}`
    );
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    return data.data.map((item: any) => ({
      id: item.id,
      media_type: item.media_type,
      media_url: item.media_url,
      permalink: item.permalink,
      thumbnail_url: item.thumbnail_url,
      caption: item.caption,
      timestamp: item.timestamp,
      like_count: item.like_count,
      comments_count: item.comments_count,
    }));
  } catch (error) {
    console.error("Error fetching Instagram posts:", error);
    return [];
  }
};

// Fetch Instagram reels
export const fetchInstagramReels = async (
  token: string,
  limit: number = 6
): Promise<InstagramMedia[]> => {
  try {
    const igAccountId = await getInstagramBusinessAccountId(token);

    // Fetch the reels (filtering for VIDEO type)
    const response = await fetch(
      `${INSTAGRAM_CONFIG.apiBaseUrl}/${igAccountId}/media?fields=id,media_type,media_url,permalink,thumbnail_url,caption,timestamp,like_count,comments_count&limit=${limit}&access_token=${token}`
    );
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    // Filter for reels/videos only
    return data.data
      .filter((item: any) => item.media_type === "VIDEO")
      .map((item: any) => ({
        id: item.id,
        media_type: item.media_type,
        media_url: item.media_url,
        permalink: item.permalink,
        thumbnail_url: item.thumbnail_url,
        caption: item.caption,
        timestamp: item.timestamp,
        like_count: item.like_count,
        comments_count: item.comments_count,
      }));
  } catch (error) {
    console.error("Error fetching Instagram reels:", error);
    return [];
  }
};

// Utility function to format numbers
export const formatNumberToShortForm = (count: number): string => {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + "M";
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + "K";
  }
  return count.toString();
};
