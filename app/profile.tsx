import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useUser } from "../context/UserContext";

export default function ProfileScreen() {
  const { user, logout } = useUser();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user?.email}</Text>

      <TouchableOpacity style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    width: "80%",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "red",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});
