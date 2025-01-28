// login.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { TouchableOpacity, Image, View, Text, StyleSheet, Modal } from "react-native";
import { GestureHandlerRootView, ScrollView, TextInput } from "react-native-gesture-handler";
import { auth } from '../firebase'
import { signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@/components/ThemeContext";
import React from "react";

export default function Login() {
    const { isLightScheme } = useTheme();
    const themeTextStyle = isLightScheme ? styles.lightThemeText : styles.darkThemeText;
    const themeContainerStyle = isLightScheme ? styles.lightContainer : styles.darkContainer;
    const themeTextInputStyle = isLightScheme
    ? [styles.inputLight, styles.lightTextInput]
    : [styles.inputDark, styles.darkTextInput];
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // To manage and display error messages
    const passwordInputRef = useRef<TextInput>(null); // Reference for password input
    const [isModalVisible, setModalVisible] = useState(false); // State for modal visibility

    const handleLogin = () => {

        if (!email || !password) {
            setError('Email and Password are required.');
            return;
        }
        signInWithEmailAndPassword(auth, email, password)
            .then(async userCredentials => {
                const user = userCredentials.user;
                console.log("Logged in with ", user.email);
                {/*
                try {
                    const jsonValue = JSON.stringify(user); // User object containing id, email, and token
                    await AsyncStorage.setItem('loggedInUser', jsonValue);
                  } catch (error) {
                    console.error('Error saving user data:', error);
                  }
                */}
                setError(''); // Clear error message on success

                const userUID = user.uid; // Get the logged-in user's UID
                const currentDate = new Date().toDateString(); // Only get the date part

                // Retrieve user-specific data
                const selectedSong = await AsyncStorage.getItem(`${userUID}_selectedSong`);
                const lastLoginDate = await AsyncStorage.getItem(`${userUID}_lastLoginDate`);

                if (lastLoginDate !== currentDate) {
                    // Dates don't match, navigate to EnterSOTD
                    await AsyncStorage.setItem(`${userUID}_lastLoginDate`, currentDate);
                    router.push("/enterSong")
                } else {
                    if (selectedSong) {
                        router.push("/tabs/home")
                    } else {
                        router.push( "/enterSong")
                    }
                }
            })
            .catch(error => {
                setError(error.message);
                setModalVisible(true); // Show modal for non-unique username
            }
            ); // Display the error message
    }

    return (
        <GestureHandlerRootView style={[styles.container, themeContainerStyle]}>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardDismissMode="on-drag"  // Hide keyboard when dragging/swiping
                keyboardShouldPersistTaps="handled" // Dismiss keyboard on tap
            >
                {/* Back Button */}
                <View style={styles.backButton}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="blue" />
                    </TouchableOpacity>
                </View>
                {/* Logo */}
                <View style={styles.imageContainer}>
                    <Image source={require('@/assets/images/logo_only.png')} style={styles.logo} />
                </View>
                {/* Main Text */}
                <View style={styles.mainTextContainer}>
                    <Text style={themeTextStyle}>Welcome Back!</Text>
                </View>
                {/* Email and Password Input */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={themeTextInputStyle}
                        value={email}
                        onChangeText={text => {
                            setEmail(text.replace(/\s/g, ''));
                            setError('');
                        }} // Remove spaces
                        placeholder="Email"
                        placeholderTextColor={isLightScheme ? "#A9A9A9" : "#505050"}
                        autoCapitalize="none"
                        returnKeyType="next" // Show "Next" button on the keyboard
                        onSubmitEditing={() => passwordInputRef.current?.focus()} // Move to password input on "Next"
                        blurOnSubmit={false} // Prevent keyboard from dismissing
                    />
                    <TextInput
                        style={themeTextInputStyle}
                        value={password}
                        onChangeText={text => setPassword(text)}
                        placeholder="Password"
                        placeholderTextColor={isLightScheme ? "#A9A9A9" : "#505050"}
                        secureTextEntry
                        autoCapitalize="none"
                        returnKeyType="done" // Show "Done" button on the keyboard
                        ref={passwordInputRef} // Use the reference for focusing
                        onSubmitEditing={handleLogin} // Trigger login when "Done" is pressed
                    />
                </View>
                {/* Login Button */}
                <TouchableOpacity style={styles.buttonContainer} onPress={() => handleLogin()}>
                    <Text style={{ color: 'white' }}>Log In</Text>
                </TouchableOpacity>

                 {/* Modal for error messages */}
                <Modal
                    transparent={true}
                    animationType="slide"
                    visible={isModalVisible}
                    onRequestClose={() => setModalVisible(false)}
                    >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                        <Text style={styles.modalText}>{error}</Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.modalButtonText}>OK</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1, // Makes the scroll container expand fully
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1,
    },
    imageContainer: {
        padding: 20,
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    mainTextContainer: {
        padding: 20,
    },
    mainText: {
        fontWeight: 'bold',
        textAlign: 'center',
    },
    buttonContainer: {
        padding: 20,
        backgroundColor: '#f34727',
        borderRadius: 20,
        margin: 30,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    googleLogo: {
        color: 'white',
        marginRight: 10,
    },
    inputContainer: {
        width: '80%'
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
      },
      modalText: {
        marginBottom: 20,
        fontSize: 16,
        textAlign: 'center',
      },
      modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#f34727',
        borderRadius: 5,
      },
      modalButtonText: {
        color: 'white',
        fontWeight: 'bold',
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
    inputDark: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 16,
        padding: 8,
        borderRadius: 4,
        //:  "#242c40",
    },
    inputLight: {
        height: 40,
        borderColor: "#242c40",
        borderWidth: 1,
        marginBottom: 16,
        padding: 8,
        borderRadius: 4,
        //color: '#ddd',
    },
    lightTextInput: {
        color: '#000', // Black text for light mode
      },
      darkTextInput: {
        color: '#fff', // White text for dark mode
      },
});
