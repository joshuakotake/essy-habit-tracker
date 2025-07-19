import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import ThemedView from "../ThemedView";
import ThemedText from "../ThemedText";
import ThemedButton from "../ThemedButton";
import ThemedTextInput from "../ThemedTextInput";

import { Colors } from "../../constants/Colors";
import { useHabits } from "../../hooks/useHabits";

// Create Modal Component
const CreateModal = ({ visible, onClose }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { createHabit } = useHabits();

  const handleSubmit = async () => {
    if (!name.trim()) return;

    setLoading(true);
    await createHabit(name);
    setName("");
    setLoading(false);
    onClose();
  };

  const handleClose = () => {
    setName("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ThemedView style={styles.modalContainer}>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close-outline" size={28} />
          </Pressable>
          <View style={styles.modalHeader}>
            <ThemedText title style={styles.modalTitle}>
              Create
            </ThemedText>
            <View />
          </View>

          <View style={styles.createContent}>
            <ThemedTextInput
              placeholder="Habit Name"
              value={name}
              onChangeText={setName}
            />
            <ThemedButton
              title={loading ? "Saving..." : "Create Habit"}
              onPress={handleSubmit}
              disabled={loading}
            />
          </View>
        </ThemedView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CreateModal;

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
  createContent: {
    flex: 1,
    gap: 20,
  },
});
