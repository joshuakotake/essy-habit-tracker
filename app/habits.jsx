import React, { useState, useEffect } from "react";
import { View, StyleSheet, Pressable, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import ThemedView from "../components/ThemedView";
import ThemedText from "../components/ThemedText";
import ThemedCard from "../components/ThemedCard";
import ThemedLoader from "../components/ThemedLoader";
import { Colors } from "../constants/Colors";
import { useHabits } from "../hooks/useHabits";
import { useUser } from "../hooks/useUser";

import ProfileModal from "../components/modals/profileModal";
import CreateModal from "../components/modals/createModal";
import DetailsModal from "../components/modals/detailsModal";

// Modal Types
const MODAL_TYPES = {
  NONE: "none",
  PROFILE: "profile",
  CREATE: "create",
  DETAILS: "details",
};

export default function HabitsPage() {
  const { habits, loading, error, updateHabit } = useHabits();
  const { user, logout, authChecked } = useUser();
  const router = useRouter();

  const [currentModal, setCurrentModal] = useState(MODAL_TYPES.NONE);
  const [selectedHabit, setSelectedHabit] = useState(null);

  useEffect(() => {
    if (authChecked && !user) {
      router.replace("/login");
    }
  }, [user, authChecked, router]);

  const openModal = (modalType, habit = null) => {
    setCurrentModal(modalType);
    if (habit) {
      setSelectedHabit(habit);
    }
  };

  const closeModal = () => {
    setCurrentModal(MODAL_TYPES.NONE);
    setSelectedHabit(null);
  };

  if (!authChecked || !user) {
    return <ThemedLoader />;
  }

  if (loading && habits.length === 0) {
    return <ThemedLoader />;
  }

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Error loading habits: {error}</ThemedText>
      </ThemedView>
    );
  }

  const handleToggle = async (habit) => {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

    const completedDates = new Set(habit.completedDates || []);
    const lastCompleted = habit.lastCompleted
      ? habit.lastCompleted.split("T")[0]
      : null;

    let updatedCompletedDates;
    let newStreak;
    let updatedLastCompleted;

    if (lastCompleted === today && completedDates.has(today)) {
      // Uncheck today's completion
      completedDates.delete(today);
      updatedCompletedDates = Array.from(completedDates);

      console.log("UNCHECK: ", updatedCompletedDates);
      newStreak = Math.max(0, (habit.streak || 1) - 1);
      updatedLastCompleted = "";
    } else {
      // Mark as completed today
      completedDates.add(today);
      updatedCompletedDates = Array.from(completedDates);

      console.log("CHECK: ", updatedCompletedDates);

      newStreak = (habit.streak || 0) + 1;
      updatedLastCompleted = new Date().toISOString();
    }

    const updatedHabit = {
      ...habit,
      completedDates: updatedCompletedDates,
      streak: newStreak,
      lastCompleted: updatedLastCompleted,
    };

    try {
      await updateHabit(habit.$id, {
        name: habit.name,
        streak: newStreak,
        startDate: habit.startDate,
        completedDates: updatedCompletedDates,
        lastCompleted: updatedLastCompleted,
      });

      // Optimistically update UI (optional but makes it feel snappier)
      habit.completedDates = updatedCompletedDates;
      habit.streak = newStreak;
      habit.lastCompleted = updatedLastCompleted;
    } catch (error) {
      console.error("Toggle failed:", error.message);
    }
  };

  return (
    <ThemedView style={styles.container} safe={true}>
      <View style={styles.header}>
        <Pressable onPress={() => openModal(MODAL_TYPES.PROFILE)}>
          <Ionicons name="menu-outline" size={28} color={Colors.primary} />
        </Pressable>

        <ThemedText title style={styles.title}>
          Habits
        </ThemedText>

        <Pressable onPress={() => openModal(MODAL_TYPES.CREATE)}>
          <Ionicons name="add" size={28} color={Colors.primary} />
        </Pressable>
      </View>

      {habits.length === 0 ? (
        <View style={styles.container}>
          <ThemedText style={styles.emptyText}>No habits yet!</ThemedText>
          <ThemedText style={styles.emptySubtext}>
            Tap the + button to create your first habit
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={habits}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <Pressable onPress={() => openModal(MODAL_TYPES.DETAILS, item)}>
              <ThemedCard style={styles.habitCard}>
                <ThemedText style={styles.habitName}>{item.name}</ThemedText>
                <View style={styles.streak}>
                  <Pressable
                    onPress={(e) => {
                      e.stopPropagation();
                      handleToggle(item);
                    }}
                    hitSlop={10}
                  >
                    <Ionicons
                      name={
                        item.lastCompleted &&
                        item.lastCompleted.split("T")[0] ===
                          new Date().toDateString().split("T")[0]
                          ? "checkmark-circle"
                          : "checkmark-circle-outline"
                      }
                      size={24}
                      color={Colors.primary}
                    />
                    <ThemedText style={styles.streakCount}>
                      {item.streak || 0}
                    </ThemedText>
                  </Pressable>
                </View>
              </ThemedCard>
            </Pressable>
          )}
        />
      )}

      {/* Profile Modal */}
      <ProfileModal
        visible={currentModal === MODAL_TYPES.PROFILE}
        onClose={closeModal}
        user={user}
        logout={logout}
      />

      {/* Create Habit Modal */}
      <CreateModal
        visible={currentModal === MODAL_TYPES.CREATE}
        onClose={closeModal}
      />

      {/* Habit Details Bottom Sheet */}
      {selectedHabit && (
        <DetailsModal
          habit={selectedHabit}
          visible={currentModal === MODAL_TYPES.DETAILS}
          onClose={closeModal}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
    marginBottom: 24,
  },
  title: {
    textAlign: "center",
    flex: 1,
  },
  habitCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    padding: 16,
  },
  habitName: {
    fontSize: 16,
    color: Colors.text,
    flex: 1,
  },
  streak: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
  },
  streakCount: {
    fontWeight: "600",
    color: Colors.text,
    marginLeft: 4,
    textAlign: "center",
    minWidth: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: Colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});
