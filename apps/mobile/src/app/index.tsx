import { Text, View, StyleSheet } from "react-native";
import { Greeting } from "@repo/mobile-ui";

export default function Index() {
  return (
    <View style={styles.container}>
      <Greeting />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
