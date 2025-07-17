import { TextInput, StyleSheet } from "react-native";
import { Colors } from "../constants/Colors";

const ThemedTextInput = ({ style, ...props }) => (
  <TextInput
    style={[
      styles.input,
      {
        backgroundColor: Colors.surface,
        color: Colors.text,
        borderColor: Colors.border,
      },
      style,
    ]}
    placeholderTextColor={Colors.textLight}
    {...props}
  />
);

const styles = StyleSheet.create({
  input: {
    padding: 14,
    borderRadius: 8,
    marginVertical: 8,
    fontSize: 16,
    borderWidth: 1,
  },
});

export default ThemedTextInput;
