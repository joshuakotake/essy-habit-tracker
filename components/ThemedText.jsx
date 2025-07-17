import { Text, StyleSheet } from "react-native";
import { Colors } from "../constants/Colors";

const ThemedText = ({ style, title, ...props }) => (
  <Text
    style={[
      styles.base,
      title && styles.title,
      {
        color: title ? Colors.text : Colors.textLight,
      },
      style,
    ]}
    {...props}
  />
);

const styles = StyleSheet.create({
  base: {
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default ThemedText;
