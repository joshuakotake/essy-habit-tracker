import {
  Modal,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { useHabits } from "../../hooks/useHabits";

import { Colors } from "../../constants/Colors";
import ThemedView from "../ThemedView";
import ThemedLoader from "../ThemedLoader";
import ThemedText from "../ThemedText";
import ThemedButton from "../ThemedButton";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";

const HabitDetails = ({ visible, onClose, habit }) => {
  const { deleteHabit } = useHabits();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!habit.$id) return null;

    setLoading(true);
    await deleteHabit(habit.$id);
    setLoading(false);
    onClose();
    router.replace("/habits");
  };

  const getMarkedDates = (dates = []) => {
    const marked = {};
    dates.forEach((date) => {
      marked[date] = {
        marked: true,
        dotColor: Colors.tint,
        selected: true,
        selectedColor: Colors.tint,
      };
    });
    return marked;
  };

  if (!habit) return <ThemedLoader />;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ThemedView style={styles.modalContainer}>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close-outline" size={28} />
          </Pressable>
          <View style={styles.modalHeader}>
            <ThemedText title style={styles.modalTitle}>
              {habit.name}
            </ThemedText>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.calendarContainer}>
            <Calendar
              markedDates={getMarkedDates(habit.completedDates)}
              theme={{
                backgroundColor: Colors.background,
                calendarBackground: Colors.background,
                selectedDayBackgroundColor: Colors.tint,
                todayTextColor: Colors.tint,
                arrowColor: Colors.tint,
                textSectionTitleColor: Colors.text,
                dayTextColor: Colors.text,
              }}
            />
          </View>

          <View>
            <ThemedText>
              {habit.streak}
              {habit.startDate}
              {habit.lastCompleted}
              {habit.completedDates}
            </ThemedText>
            <ThemedButton
              title={loading ? "Deleting..." : "Delete"}
              onPress={handleDelete}
              disabled={loading}
            />
          </View>
        </ThemedView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default HabitDetails;

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
  calendarContainer: {
    marginVertical: 20,
  },
});
