import { TouchableOpacity, StyleSheet } from "react-native";
import ThemedText from "./ThemedText";
import { Colors } from "../constants/Colors";

const ThemedButton = ({ title, onPress, style }) => (
  <TouchableOpacity
    style={[
      styles.button,
      {
        backgroundColor: Colors.primary,
      },
      style,
    ]}
    onPress={onPress}
    activeOpacity={0.9}
  >
    <ThemedText style={styles.buttonText}>{title}</ThemedText>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 12,
  },
  buttonText: {
    fontSize: 16,
    color: Colors.background,
  },
});

export default ThemedButton;
