import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Image,
  Dimensions,
  FlatList,
  Pressable,
  Alert,
} from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import {
  fetchInstagramProfile,
  fetchInstagramPosts,
  fetchInstagramReels,
  exchangeCodeForToken,
  formatNumberToShortForm,
  InstagramProfile,
  InstagramMedia,
} from "./utils/instagram-api";

export default function InfluencerContent() {
  // Get the Instagram access token from params
  const { token: accessToken } = useLocalSearchParams<{ token: string }>();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<InstagramProfile | null>(null);
  const [posts, setPosts] = useState<InstagramMedia[]>([]);
  const [reels, setReels] = useState<InstagramMedia[]>([]);
  const [activeTab, setActiveTab] = useState<"posts" | "reels">("posts");

  useEffect(() => {
    async function fetchData() {
      try {
        if (!accessToken) {
          setError("No Instagram access token provided");
          setLoading(false);
          return;
        }

        // Fetch profile and media data using the access token
        const [profileData, postsData, reelsData] = await Promise.all([
          fetchInstagramProfile(accessToken),
          fetchInstagramPosts(accessToken),
          fetchInstagramReels(accessToken),
        ]);

        if (!profileData) {
          throw new Error("Failed to fetch profile data");
        }

        setProfile(profileData);
        setPosts(postsData);
        setReels(reelsData);
      } catch (err) {
        console.error("Error fetching Instagram data:", err);
        setError("Error fetching Instagram data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [accessToken]);

  // Format engagement numbers
  const formatEngagement = (count: number | undefined): string => {
    if (!count) return "0";
    return formatNumberToShortForm(count);
  };

  // Render media item (post or reel)
  const renderMediaItem = ({ item }: { item: InstagramMedia }) => {
    const windowWidth = Dimensions.get("window").width;
    const itemWidth = (windowWidth - 60) / 2; // 2 items per row with padding

    return (
      <View style={[styles.mediaItem, { width: itemWidth }]}>
        <Image
          source={{
            uri:
              item.media_type === "VIDEO" ? item.thumbnail_url : item.media_url,
          }}
          style={styles.mediaImage}
          resizeMode="cover"
        />
        <View style={styles.mediaOverlay}>
          <View style={styles.engagementContainer}>
            <Text style={styles.engagementText}>
              ♥ {formatEngagement(item.like_count)}
            </Text>
            <Text style={styles.engagementText}>
              💬 {formatEngagement(item.comments_count)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // If loading, show loading indicator
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Link href="/" style={styles.backLink}>
            ← Back
          </Link>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4a80f5" />
          <Text style={styles.loadingText}>
            Loading your Instagram profile...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // If error, show error message
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Link href="/" style={styles.backLink}>
            ← Back
          </Link>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Oops!</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <Pressable
            style={({ pressed }) => [
              styles.retryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => {
              setLoading(true);
              setError(null);
              // Re-trigger the useEffect
              if (accessToken) {
                fetchInstagramProfile(accessToken)
                  .then((data) => {
                    if (data) setProfile(data);
                    setLoading(false);
                  })
                  .catch(() => {
                    setError(
                      "Failed to fetch Instagram data. Please try again."
                    );
                    setLoading(false);
                  });
              }
            }}
          >
            <Text style={styles.buttonText}>Retry</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Link href="/" style={styles.backLink}>
            ← Back
          </Link>
        </View>

        {/* Profile Section */}
        {profile && (
          <View style={styles.profileSection}>
            <Image
              source={{ uri: profile.profile_picture_url }}
              style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.username}>@{profile.username}</Text>
              <Text style={styles.fullName}>{profile.full_name}</Text>
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {formatNumberToShortForm(profile.followers_count)}
                  </Text>
                  <Text style={styles.statLabel}>Followers</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{profile.media_count}</Text>
                  <Text style={styles.statLabel}>Posts</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        <Text style={styles.bioText}>{profile?.biography}</Text>

        {/* Tabs for Posts and Reels */}
        <View style={styles.tabContainer}>
          <Pressable
            style={[styles.tab, activeTab === "posts" && styles.activeTab]}
            onPress={() => setActiveTab("posts")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "posts" && styles.activeTabText,
              ]}
            >
              Top Posts
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === "reels" && styles.activeTab]}
            onPress={() => setActiveTab("reels")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "reels" && styles.activeTabText,
              ]}
            >
              Top Reels
            </Text>
          </Pressable>
        </View>

        {/* Media Content Section */}
        <View style={styles.mediaSection}>
          {activeTab === "posts" ? (
            posts.length > 0 ? (
              <FlatList
                data={posts}
                renderItem={renderMediaItem}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.mediaRow}
                scrollEnabled={false}
              />
            ) : (
              <Text style={styles.noContentText}>No posts available</Text>
            )
          ) : reels.length > 0 ? (
            <FlatList
              data={reels}
              renderItem={renderMediaItem}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={styles.mediaRow}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.noContentText}>No reels available</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 16,
  },
  backLink: {
    fontSize: 16,
    color: "#4a80f5",
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#e74c3c",
    marginBottom: 12,
  },
  errorMessage: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: "#4a80f5",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  profileSection: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 16,
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  fullName: {
    fontSize: 16,
    color: "#666",
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: "row",
  },
  statItem: {
    marginRight: 24,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  bioText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#555",
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#ddd",
  },
  activeTab: {
    borderBottomColor: "#4a80f5",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
  },
  activeTabText: {
    color: "#4a80f5",
  },
  mediaSection: {
    paddingHorizontal: 10,
    marginBottom: 40,
  },
  mediaRow: {
    justifyContent: "space-between",
    marginBottom: 10,
  },
  mediaItem: {
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: 5,
    marginBottom: 20,
  },
  mediaImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#eee",
  },
  mediaOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  engagementContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  engagementText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  noContentText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },
});
