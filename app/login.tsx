import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../utils/formSchemas";
import { useUser } from "../context/UserContext";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useUser();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: any) => {
    await login(data.email, data.password);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput 
        style={styles.inputContainer} 
        placeholder="Email" 
        keyboardType="email-address" 
        autoCapitalize="none"
        onChangeText={(text) => setValue("email", text)}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.inputField} 
          placeholder="Password" 
          secureTextEntry={!showPassword}
          onChangeText={(text) => setValue("password", text)}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="gray" />
        </TouchableOpacity>
      </View>
      {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

      <TouchableOpacity onPress={() => router.push("/forgot-password")}>
        <Text style={styles.linkText}>Forgot your password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)} disabled={isLoading}>
        <Text style={styles.buttonText}>{isLoading ? "Logging in..." : "Login"}</Text>
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    width: "80%",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  inputField: {
    flex: 1,
    padding: 10,
  },
  button: {
    width: "80%",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#007bff",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  linkText: {
    marginTop: 10,
    color: "#007bff",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    alignSelf: "flex-start",
    width: "80%",
  },
});
