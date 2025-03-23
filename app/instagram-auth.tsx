import React, { useRef, useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Link, useRouter } from "expo-router";
import InstagramLogin from "react-native-instagram-login";
import CookieManager from "@react-native-community/cookies";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Context keys
const CONTEXT_KEYS = {
  INSTAGRAM_TOKEN: "instagram_token",
  INSTAGRAM_USER_ID: "instagram_user_id",
  INSTAGRAM_USER_DATA: "instagram_user_data",
  INSTAGRAM_MEDIA_DATA: "instagram_media_data",
};

// Add these interfaces at the top of the file after imports
interface InstagramUserData {
  id: string;
  username: string;
  account_type: string;
  media_count: number;
}

interface InstagramMediaItem {
  id: string;
  caption?: string;
  media_type: string;
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
}

interface InstagramError {
  error: {
    message: string;
    type: string;
    code: number;
  };
}

export default function InstagramAuth() {
  const router = useRouter();
  const instagramLoginRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);

  // Check for existing context on mount
  useEffect(() => {
    checkExistingAuth();
  }, []);

  const checkExistingAuth = async () => {
    try {
      const token = await AsyncStorage.getItem(CONTEXT_KEYS.INSTAGRAM_TOKEN);
      if (token) {
        // If we have a token, verify it's still valid
        const isValid = await verifyToken(token);
        if (isValid) {
          router.push({
            pathname: "/influencer-content",
            params: { token },
          });
          return;
        }
        // If token is invalid, clear it
        await AsyncStorage.multiRemove([
          CONTEXT_KEYS.INSTAGRAM_TOKEN,
          CONTEXT_KEYS.INSTAGRAM_USER_ID,
        ]);
      }
    } catch (error) {
      console.error("Error checking existing auth:", error);
    }
  };

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v19.0/me?access_token=${token}`
      );
      const data = await response.json();
      return !data.error;
    } catch {
      return false;
    }
  };

  // Function to handle successful Instagram login
  const handleLoginSuccess = async (data: any) => {
    try {
      setLoading(true);
      console.log("Instagram login success! Data:", data);

      if (!data?.access_token) {
        throw new Error("No access token received from Instagram");
      }

      try {
        // Fetch user profile data
        const userResponse = await fetch(
          `https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${data.access_token}`
        );
        const userData = (await userResponse.json()) as
          | InstagramUserData
          | InstagramError;

        if ("error" in userData) {
          throw new Error(userData.error.message);
        }

        // Fetch user's media (posts, reels, etc)
        const mediaResponse = await fetch(
          `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${data.access_token}`
        );
        const mediaData = (await mediaResponse.json()) as
          | { data: InstagramMediaItem[] }
          | InstagramError;

        if ("error" in mediaData) {
          throw new Error(mediaData.error.message);
        }

        // Save all necessary data to context
        await AsyncStorage.multiSet([
          [CONTEXT_KEYS.INSTAGRAM_TOKEN, data.access_token],
          [CONTEXT_KEYS.INSTAGRAM_USER_ID, userData.id],
          [CONTEXT_KEYS.INSTAGRAM_USER_DATA, JSON.stringify(userData)],
          [CONTEXT_KEYS.INSTAGRAM_MEDIA_DATA, JSON.stringify(mediaData.data)],
        ]);

        // Navigate to the profile screen with all the data
        router.push({
          pathname: "/influencer-content",
          params: {
            token: data.access_token,
            userData: JSON.stringify(userData),
            mediaData: JSON.stringify(mediaData.data),
          },
        });
      } catch (error: unknown) {
        console.log("Error fetching Instagram data:", error);
        console.error("Error fetching Instagram data:", error);
        Alert.alert(
          "Data Fetch Error",
          "Unable to fetch your Instagram content. Please ensure you have:\n\n" +
            "1. Granted all required permissions\n" +
            "2. Have public content on your Instagram account\n\n" +
            "Error: " +
            (error instanceof Error ? error.message : "Unknown error")
        );
        return;
      }
    } catch (error: unknown) {
      console.error("Error handling Instagram login:", error);
      Alert.alert(
        "Login Error",
        "There was a problem logging in with Instagram. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Function to handle Instagram login failure
  const handleLoginFailure = (data: any) => {
    console.error("Instagram login failure:", data);

    // Check for specific error types
    if (data?.error_message?.includes("Insufficient developer role")) {
      Alert.alert(
        "Instagram Setup Required",
        "Your Instagram account needs to be set up as a tester. Please check if:\n\n" +
          "1. Your account is a Business/Creator account\n" +
          "2. You've accepted the tester invite in Instagram settings\n" +
          "3. You're logged in with the correct Instagram account\n\n" +
          "Try logging in using an incognito/private browser window."
      );
    } else if (data?.error_message?.includes("No Facebook Page found")) {
      Alert.alert(
        "Facebook Page Required",
        "To use this feature, you need:\n\n" +
          "1. A Facebook Page\n" +
          "2. Admin access to the Facebook Page\n\n" +
          "Please create a Facebook Page and try again."
      );
    } else if (
      data?.error_message?.includes("No Instagram Business Account found")
    ) {
      Alert.alert(
        "Instagram Business Account Required",
        "To use this feature, you need:\n\n" +
          "1. An Instagram Business or Creator account\n" +
          "2. Your Instagram account connected to your Facebook Page\n\n" +
          "Please update your Instagram account settings and try again."
      );
    } else {
      Alert.alert(
        "Login Failed",
        "Failed to log in with Instagram. Please try again."
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4a80f5" />
          <Text style={styles.loadingText}>
            Connecting to your Instagram...
          </Text>
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.header}>
            <Link href="/" style={styles.backLink}>
              ← Back
            </Link>
          </View>

          <Text style={styles.title}>Connect with Instagram</Text>
          <Text style={styles.subtitle}>
            Log in with your Instagram account to showcase your content and find
            product matches
          </Text>

          <View style={styles.logoContainer}>
            <View style={styles.instagramLogo}>
              <Text style={styles.logoText}>Instagram</Text>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.loginButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => {
              console.log("Instagram login config:", {
                appId: Constants.expoConfig?.extra?.INSTAGRAM_APP_ID,
                redirectUrl:
                  Constants.expoConfig?.extra?.INSTAGRAM_REDIRECT_URI,
              });
              instagramLoginRef.current?.show();
            }}
          >
            <Text style={styles.loginButtonText}>Log in with Instagram</Text>
          </Pressable>

          <Text style={styles.privacyText}>
            By connecting your account, you agree to our Terms of Service and
            Privacy Policy
          </Text>

          {/* Instagram Login Component (Hidden until button press) */}
          <InstagramLogin
            ref={instagramLoginRef}
            appId={Constants.expoConfig?.extra?.INSTAGRAM_APP_ID}
            appSecret={Constants.expoConfig?.extra?.INSTAGRAM_APP_SECRET}
            redirectUrl={Constants.expoConfig?.extra?.INSTAGRAM_REDIRECT_URI}
            scopes={[
              "instagram_business_basic",
              "instagram_business_content_publish",
            ]}
            onLoginSuccess={handleLoginSuccess}
            onLoginFailure={handleLoginFailure}
            responseType="code"
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    marginBottom: 24,
  },
  backLink: {
    fontSize: 16,
    color: "#4a80f5",
    fontWeight: "500",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 36,
    textAlign: "center",
    lineHeight: 22,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  instagramLogo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#E1306C",
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginButton: {
    backgroundColor: "#4a80f5",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  loginButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  privacyText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    lineHeight: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
