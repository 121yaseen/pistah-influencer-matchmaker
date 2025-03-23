import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  SafeAreaView,
  Platform,
} from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Influencer Match Maker</Text>
        <Text style={styles.subtitle}>How would you like to proceed?</Text>

        <View style={styles.buttonContainer}>
          <Link href="/instagram-auth" asChild>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.influencerButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.buttonText}>I'm an Influencer</Text>
            </Pressable>
          </Link>

          <Link href="/product-owner-registration" asChild>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.productOwnerButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.buttonText}>I'm a Product Owner</Text>
            </Pressable>
          </Link>
        </View>
      </View>
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
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
    color: "#333",
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 40,
    color: "#666",
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 320,
    gap: 20,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  influencerButton: {
    backgroundColor: "#4a80f5",
  },
  productOwnerButton: {
    backgroundColor: "#5c6bc0",
  },
  buttonText: {
    color: "black",
    fontSize: 18,
    fontWeight: "600",
  },
});
