import { View, StyleSheet } from "react-native";
import { Colors } from "../constants/Colors";

const ThemedCard = ({ children, style, ...props }) => {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.text,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
});

export default ThemedCard;
