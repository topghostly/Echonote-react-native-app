import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColor } from "@/context/ColorProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Auth = () => {
  const { colors } = useColor(); // Get default colors

  const userRef = useRef(null);

  const nameCheck = () => {
    if (userRef.current?.value.length < 2) {
      return true;
    }
  };

  const hamdleGetUserName = async () => {
    let userName;
    if (userRef.current) {
      const userName = userRef.current?.value;
      console.log(userName);
    }

    try {
      const userProfile = {
        name: userName,
      };

      const jsonUserProfile = JSON.stringify(userProfile);

      await AsyncStorage.setItem("userprofile", jsonUserProfile);
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
            ref={userRef}
            style={{
              flex: 1,
              color: "#656625",
              fontFamily: "Causten-SemiBold",
              fontSize: 35,
              textAlign: "center",
            }}
            placeholder="Who goes there?"
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

export default Auth;

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
