import { Text, StyleSheet, View, Easing, TouchableOpacity, Image, ActivityIndicator, Animated } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "@/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function Index() {
  const { isLightScheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // AsyncStorage attempt to keep user logged in
  {/*
  useEffect(() => {
    const checkUser = async () => {
      const storedUser = await AsyncStorage.getItem("loggedInUser");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const userUID = JSON.parse(storedUser).uid;
        const currentDate = new Date().toDateString();
        const selectedSong = await AsyncStorage.getItem(`${userUID}_selectedSong`);
        const lastLoginDate = await AsyncStorage.getItem(`${userUID}_lastLoginDate`);

        auth.updateCurrentUser(parsedUser); // Update currentUser

        console.log(auth.currentUser)

        if (lastLoginDate !== currentDate) {
          await AsyncStorage.setItem(`${userUID}_lastLoginDate`, currentDate);
          router.push("/enterSong");
        } else {
          if (selectedSong) {
            router.push("/tabs/home");
          } else {
            router.push("/enterSong");
          }
        }
      } 
    };
    checkUser();
  }, []);
  */}

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userUID = user.uid;
        const currentDate = new Date().toDateString();
        const selectedSong = await AsyncStorage.getItem(`${userUID}_selectedSong`);
        const lastLoginDate = await AsyncStorage.getItem(`${userUID}_lastLoginDate`);
  
        if (lastLoginDate !== currentDate) {
          await AsyncStorage.setItem(`${userUID}_lastLoginDate`, currentDate);
          router.push("/enterSong");
        } else {
          if (selectedSong) {
            router.push("/tabs/home");
          } else {
            router.push("/enterSong");
          }
        }
      } else{
        setLoading(false);
      }
    });
  
    return () => unsubscribe();
  }, []);


  const spinValue = useState(new Animated.Value(0))[0];
  // Set up animation loop
  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,  // Adjust duration as needed
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    animation.start();
  
    return () => animation.stop(); // Clean up on component unmount
  }, [spinValue]);
  
  // Interpolating spin value
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  

  const themeTextStyle = isLightScheme ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle = isLightScheme ? styles.lightContainer : styles.darkContainer;

if (loading) {
  setTimeout(() => setLoading(false), 4000);  // 2-second delay
    return (
      <View style={[styles.loadingContainer, themeContainerStyle]}>
        {/*<ActivityIndicator size="large" color={isLightScheme?"black":"white"} />*/}
        <View style={styles.animatedImageContainer}>
          <Animated.Image 
            source={require('@/assets/images/logo_only.png')} 
            style={[
              styles.logo,
              {
                transform: [
                  {rotate: spin}
                ],
              },
            ]}
            />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, themeContainerStyle]}>
      {/* Logo */}
      <View style={styles.imageContainer}>
          <Image source={require('@/assets/images/logo_only.png')} style={styles.logo} />
      </View>

      <Text style={[styles.info, themeTextStyle]}>Welcome to Jam!</Text>
      {/* Sign Up Page*/}
      <TouchableOpacity style={styles.button} onPress={() => router.push("/signup")} >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
        {/* Login Page*/}
        <TouchableOpacity style={styles.button} onPress={() => router.push("/login")} >
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
      {/* Dynamically change the status bar style */}
      <StatusBar style={isLightScheme ? "dark" : "light"} /> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    marginTop: 20,
    padding: 20,
  },
  info: {
    marginTop: 30,
  },
  button: {
    width: 120,
      borderRadius: 20,
      margin: 30,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: '#f34727',
  },
  imageContainer: {
    padding: 20,
    alignItems: 'center',
},
animatedImageContainer: {
  padding: 20,
  alignItems: 'center',
},
logo: {
    width: 100,
    height: 100,
    borderRadius: 10,
},


  lightContainer: {
    backgroundColor: "#d0d0c0",
  },
  darkContainer: {
    backgroundColor: "#242c40",
  },
  lightThemeText: {
    color: "black",
  },
  darkThemeText: {
    color: "white",
  },
  buttonText: {
    color: "white",  }
});
