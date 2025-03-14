import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColor } from "@/context/ColorProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const index = () => {
  const { colors } = useColor(); // Get default colors
  const [name, setName] = useState<string>("");

  // Check for existing user
  const checkUser = async () => {
    try {
      const existingUser = await AsyncStorage.getItem("userprofile");
      if (existingUser) {
        router.replace("/main");
      }
      return;
    } catch (error) {
      console.log("Error while chackign user");
      return;
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  const nameCheck = () => {
    if (name.length <= 1) {
      Alert.alert("Error", "Dude, why is your name a letter long");
      return true;
    }
  };

  const hamdleGetUserName = async () => {
    try {
      if (nameCheck()) {
        return;
      }

      const userProfile = {
        name: name,
      };

      const jsonUserProfile = JSON.stringify(userProfile);

      const profile = await AsyncStorage.setItem(
        "userprofile",
        jsonUserProfile
      );
      router.replace("/main");
    } catch (error) {
      console.log("Error logging in user", error);
    }
  };
  return (
    <SafeAreaView
      style={{
        backgroundColor: colors.backgroundColor,
        flex: 1,
        paddingHorizontal: 10,
      }}
    >
      <View style={styles.head}>
        <Text style={styles.logo}>EchoNote</Text>
        <Text style={styles.hero}>Echo your thoughts effortlessly</Text>
      </View>
      <View style={styles.holder}>
        <View style={styles.inputHolder}>
          <TextInput
            value={name}
            onChangeText={(e: any) => {
              setName(e);
            }}
            style={{
              flex: 1,
              color: "#656625",
              fontFamily: "Causten-SemiBold",
              fontSize: 30,
              textAlign: "center",
            }}
            placeholder="What should we call you?"
            placeholderTextColor={"#656625"}
          />
        </View>
        <TouchableOpacity
          style={{
            width: 350,
            height: 70,
            backgroundColor: "white",
            borderRadius: 100,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={hamdleGetUserName}
        >
          <Text
            style={{
              fontFamily: "Causten-SemiBold",
              fontSize: 25,
            }}
          >
            Lock it in!
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({
  head: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
    gap: 10,
  },
  logo: {
    fontFamily: "Causten-Bold",
    fontSize: 45,
  },
  hero: {
    fontFamily: "Causten-Medium",
    fontSize: 16,
  },
  holder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  inputHolder: {
    width: 350,
    height: 70,
    backgroundColor: "#B0B243",
    borderRadius: 100,
  },
});
