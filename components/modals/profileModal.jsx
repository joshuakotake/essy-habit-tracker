import React, { useEffect } from "react";
import { View, StyleSheet, Pressable, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import ThemedView from "../ThemedView";
import ThemedText from "../ThemedText";
import ThemedButton from "../ThemedButton";

import { Colors } from "../../constants/Colors";

const ProfileModal = ({ visible, onClose, user, logout }) => {
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <ThemedView style={styles.modalContainer}>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close-outline" size={28} />
        </Pressable>
        <View style={styles.modalHeader}>
          <View />
          <ThemedText title style={styles.modalTitle}>
            Profile
          </ThemedText>
        </View>

        <View style={styles.profileContent}>
          <ThemedText style={styles.email}>
            {user?.email || "Unnamed User"}
          </ThemedText>
          <ThemedButton title="Logout" onPress={logout} />
        </View>
      </ThemedView>
    </Modal>
  );
};

export default ProfileModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
    marginBottom: 24,
  },
  closeButton: {
    position: "absolute",
    left: 10,
    top: 10,
    padding: 10,
  },
  modalTitle: {
    textAlign: "center",
    flex: 1,
  },
  profileContent: {
    flex: 1,
    gap: 20,
  },
  email: {
    fontSize: 18,
    marginBottom: 20,
    color: Colors.text,
    textAlign: "center",
  },
});
