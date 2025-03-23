import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Pressable,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Link, useRouter } from "expo-router";

export default function InstagramHandle() {
  const [handle, setHandle] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Basic validation for Instagram handle
  const isValidHandle = (inputHandle: string) => {
    // Instagram handles can have letters, numbers, periods, and underscores
    // They cannot have spaces and must be between 1 and 30 characters
    const regex = /^[a-zA-Z0-9._]{1,30}$/;
    return regex.test(inputHandle);
  };

  const handleSubmit = () => {
    if (!handle.trim()) {
      setError("Please enter your Instagram handle");
      return;
    }

    if (!isValidHandle(handle)) {
      setError(
        "Please enter a valid Instagram handle (letters, numbers, periods, underscores only)"
      );
      return;
    }

    // Clear any previous errors
    setError("");

    // Navigate to the content screen with the handle as a parameter
    router.push({
      pathname: "/influencer-content",
      params: { handle: handle.trim() },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <View style={styles.header}>
          <Link href="/" style={styles.backLink}>
            ← Back
          </Link>
        </View>

        <Text style={styles.title}>Enter Your Instagram Handle</Text>
        <Text style={styles.subtitle}>
          We'll use this to match you with products that fit your style and
          audience.
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.atSymbol}>@</Text>
          <TextInput
            style={styles.input}
            placeholder="username"
            value={handle}
            onChangeText={(text) => {
              setHandle(text);
              setError(""); // Clear error when user types
            }}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="username"
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Pressable
          style={({ pressed }) => [
            styles.button,
            handle.trim().length === 0 && styles.buttonDisabled,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleSubmit}
          disabled={handle.trim().length === 0}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </Pressable>
      </KeyboardAvoidingView>
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
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 36,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 8,
  },
  atSymbol: {
    fontSize: 20,
    color: "#666",
    marginRight: 4,
  },
  input: {
    flex: 1,
    fontSize: 20,
    color: "#333",
    paddingVertical: 8,
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 14,
    marginBottom: 20,
  },
  button: {
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
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: "#a0a0a0",
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
