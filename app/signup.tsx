import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "../utils/formSchemas";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Para el icono de "ojo"

interface ErrorResponse {
  message: string;
}

export default function SignUpScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    console.log("Sending request to API with data:", data); // 👈 Agrega esto
  
    try {
      const response = await axios.post("http://10.0.2.2:5000/register", data);
      console.log("Response from API:", response.data); // 👈 Agrega esto
      router.push("/login");
    } catch (error) {
      console.error("Axios Error:", error); // 👈 Muestra el error exacto en la consola
      const axiosError = error as AxiosError<ErrorResponse>;
      Alert.alert("Error", axiosError.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput 
        style={styles.inputContainer} 
        placeholder="Email" 
        keyboardType="email-address" 
        autoCapitalize="none"
        onChangeText={(text) => setValue("email", text)}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

      {/* Password Input */}
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

      {/* Confirm Password Input */}
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.inputField} 
          placeholder="Confirm Password" 
          secureTextEntry={!showConfirmPassword}
          onChangeText={(text) => setValue("confirmPassword", text)}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={24} color="gray" />
        </TouchableOpacity>
      </View>
      {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Signing Up..." : "Sign Up"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
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
    backgroundColor: "#28a745",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  linkText: {
    marginTop: 10,
    color: "#28a745",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    alignSelf: "flex-start",
    width: "80%",
  },
});
