import React from "react";
import { Text, View, StyleSheet, Pressable, SafeAreaView } from "react-native";
import { Link } from "expo-router";

export default function ProductOwnerRegistration() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Link href="/" style={styles.backLink}>
            ← Back
          </Link>
        </View>

        <Text style={styles.title}>Product Owner Registration</Text>
        <Text style={styles.subtitle}>
          This registration flow is under development. Check back soon!
        </Text>

        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>Coming Soon</Text>
        </View>

        <Link href="/" asChild>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonText}>Return to Home</Text>
          </Pressable>
        </Link>
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
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    marginBottom: 24,
  },
  backLink: {
    fontSize: 16,
    color: "#5c6bc0",
    fontWeight: "500",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 36,
  },
  placeholderContainer: {
    backgroundColor: "#e0e0e0",
    borderRadius: 12,
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 36,
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#888",
  },
  button: {
    backgroundColor: "#5c6bc0",
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
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
