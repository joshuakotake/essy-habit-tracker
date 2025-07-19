import { ID, Permission, Query, Role } from "appwrite";
import { createContext, useEffect, useState } from "react";
import { databases, client } from "../lib/appwrite";
import { useUser } from "../hooks/useUser";

const DATABASE_ID = "6876c87c000e6c06ba18";
const COLLECTION_ID = "6876c8aa003d18fc9abb";

export const HabitsContext = createContext();

export function HabitsProvider({ children }) {
  const [habits, setHabits] = useState([]);

  const { user } = useUser();

  async function fetchHabits() {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [Query.equal("userId", user.$id)]
      );
      setHabits(response.documents);
    } catch (error) {
      console.error(error.message);
    }
  }

  async function fetchHabitById(id) {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id
      );
      return response;
    } catch (error) {
      console.error(error.message);
    }
  }

  async function createHabit(name) {
    try {
      const newHabit = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          name: name,
          streak: 0,
          startDate: new Date().toISOString(),
          lastCompleted: "",
          completedDates: [],
          userId: user.$id,
        },
        [
          Permission.read(Role.user(user.$id)),
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id)),
        ]
      );
      await fetchHabits();
    } catch (error) {
      console.error(error.message);
    }
  }

  async function deleteHabit(id) {
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
      await fetchHabits();
    } catch (error) {
      console.error(error.message);
    }
  }

  async function updateHabit(id, data) {
    try {
      const cleaned = Object.fromEntries(
        Object.entries(data).filter(([key]) => !key.startsWith("$"))
      );

      console.log(cleaned);

      await databases.updateDocument(DATABASE_ID, COLLECTION_ID, id, cleaned);
    } catch (error) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    let unsubscribe;
    const channel = `databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`;

    if (user) {
      fetchHabits();

      unsubscribe = client.subscribe(channel, (response) => {
        const { payload, events } = response;

        if (events[0].includes("create")) {
          setHabits((prevHabits) => [...prevHabits, payload]);
        }

        if (events[0].includes("delete")) {
          setHabits((prevHabits) =>
            prevHabits.filter((habit) => habit.$id !== payload.$id)
          );
        }

        if (events[0].includes("update")) {
          setHabits((prevHabits) =>
            prevHabits.map((habit) =>
              habit.$id === payload.$id ? payload : habit
            )
          );
        }
      });
    } else {
      setHabits([]);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  return (
    <HabitsContext.Provider
      value={{
        habits,
        fetchHabits,
        fetchHabitById,
        createHabit,
        deleteHabit,
        updateHabit,
      }}
    >
      {children}
    </HabitsContext.Provider>
  );
}
