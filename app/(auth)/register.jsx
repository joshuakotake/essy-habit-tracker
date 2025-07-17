import { useEffect, useState } from "react";
import {
  Text,
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
  View,
} from "react-native";
import { useUser } from "../../hooks/useUser";
import { Link, useRouter } from "expo-router";
import ThemedView from "../../components/ThemedView";
import ThemedText from "../../components/ThemedText";
import ThemedButton from "../../components/ThemedButton";
import ThemedTextInput from "../../components/ThemedTextInput";
import ThemedLoader from "../../components/ThemedLoader";
import { Colors } from "../../constants/Colors";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const { register, user, authChecked } = useUser();

  useEffect(() => {
    if (authChecked && user) {
      router.replace("/habits");
    }
  }, [authChecked, user]);

  if (!authChecked || user) {
    return <ThemedLoader />;
  }

  const handleSubmit = async () => {
    Keyboard.dismiss();
    setError(null);

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      await register(email, password);
      router.replace("/habits");
    } catch (error) {
      const message =
        error?.message || "Something went wrong. Please try again.";

      const friendlyMessage = message.includes("password")
        ? "Password must be more than 8 characters long."
        : message.includes("email")
        ? "Please enter a valid email address."
        : message;

      setError(friendlyMessage);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.container}>
        <ThemedText title style={styles.header}>
          Create Account
        </ThemedText>

        <ThemedTextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <ThemedTextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <ThemedButton title="Register" onPress={handleSubmit} />

        {error && (
          <Text style={{ color: Colors.error, textAlign: "center" }}>
            {error}
          </Text>
        )}

        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            Already have an account?{" "}
          </ThemedText>
          <Link href="/login" replace>
            <ThemedText style={{ color: Colors.primary }}>Login</ThemedText>
          </Link>
        </View>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  header: {
    marginBottom: 32,
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: {
    color: Colors.textLight,
  },
});

export default Register;
