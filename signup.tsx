// signup.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { TouchableOpacity, Image, View, Text, StyleSheet, Modal } from "react-native";
import { GestureHandlerRootView, ScrollView, TextInput } from "react-native-gesture-handler";
import { auth, provider } from '../firebase'
import { createUserWithEmailAndPassword, GoogleAuthProvider, sendEmailVerification, signInWithCredential } from "firebase/auth";
import { useTheme } from "@/components/ThemeContext";
//import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { StatusBar } from 'expo-status-bar';
import * as Google from 'expo-auth-session/providers/google'

export default function SignUp() {
    const { isLightScheme } = useTheme();
    const themeTextStyle = isLightScheme ? styles.lightThemeText : styles.darkThemeText;
    const themeContainerStyle = isLightScheme ? styles.lightContainer : styles.darkContainer;
    const themeButtonStyle = isLightScheme ? styles.darkContainer : styles.lightContainer;
    const themeButtonTextStyle = isLightScheme ? styles.darkTextInput : styles.lightTextInput;
    const themeTopBorderStyle = isLightScheme ? styles.lightTopBorder : styles.darkTopBorder;
    const themeTextInputStyle = isLightScheme ? [styles.inputLight, styles.lightTextInput] : [styles.inputDark, styles.darkTextInput];
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isModalVisible, setModalVisible] = useState(false); // State for modal visibility
    const [error, setError] = useState(''); // To manage and display error messages
    const passwordInputRef = useRef<TextInput>(null); // Reference for password input
    
    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: '970731064991-cs25mbhbc9ofn0f49k2lgg0mub6f9v05.apps.googleusercontent.com',
    });

    const handleSignUp = () => {
        if (!email || !password) {
            setError('Email and Password are required.');
            setModalVisible(true);
            return;
        }
        createUserWithEmailAndPassword(auth, email, password)
            .then(async userCredentials => {
                await sendEmailVerification(userCredentials.user);
                const user = userCredentials.user;
                //console.log("Signed up with ", user.email);
                setError(''); // Clear error message on success
                //router.replace("/username");
                // Wait for auth state to confirm the user is available
                auth.onAuthStateChanged((currentUser) => {
                    if (currentUser) {
                        router.replace("/emailVerification");
                    }
                });
            })
            .catch(error => {
                setError(error.message);
                setModalVisible(true); 
            }); // Display the error message
    }

    const handleSignUpWithGoogle = async () => { //
        try {
            const result = await promptAsync();
    
            if (result?.type === 'success') {
                const { id_token } = result.authentication;
                const credential = GoogleAuthProvider.credential(id_token);
                const userCredential = await signInWithCredential(auth, credential);
    
                console.log('Signed in with Google:', userCredential.user);
                router.replace("/username");
            } else {
                //console.error('Google Sign-In canceled or failed:', result);
                setError('Google Sign-In canceled or failed');
                setModalVisible(true);
            }
        } catch (error) {
            //console.error('Error during Google Sign-In:', error.message);
            setError('Error during Google Sign-In');
            setModalVisible(true);
        }
       
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
                    <Text style={themeTextStyle}>Welcome to Jam!</Text>
                </View>
                {/* Email and Password Input */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={themeTextInputStyle}
                        value={email}
                        onChangeText={text => setEmail(text.replace(/\s/g, ''))} // Remove spaces
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
                        onSubmitEditing={() => handleSignUp()} // Trigger login when "Done" is pressed
                    />
                </View>
                {/* Sign Up Button */}
                <TouchableOpacity style={styles.buttonContainer} onPress={() => handleSignUp()}>
                    <Text style={{ color: 'white' }}>Sign Up</Text>
                </TouchableOpacity>
                {/* Sign Up with Google */}
                <View style={[styles.topBorderSize ,themeTopBorderStyle]}>
                    <TouchableOpacity style={[styles.googleButtonContainer, themeButtonStyle]} onPress={() => handleSignUpWithGoogle()}>
                        <Ionicons size={24} name="logo-google" color={isLightScheme ? "white" : "black"}/>
                        <Text style={themeButtonTextStyle}>Sign Up with Google</Text>
                    </TouchableOpacity>
                </View>
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
            <StatusBar style={isLightScheme ? "dark" : "light"} />
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
        marginTop: 30,
        marginBottom: 30,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    googleButtonContainer: {
        padding: 10,
        //backgroundColor: '#f34727',
        borderRadius: 20,
        margin: 30,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    topBorderSize: {
        borderTopWidth: 1
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
      lightTopBorder: {
        borderTopColor: '#242c40',
      },
      darkTopBorder: {
        borderTopColor: "#d0d0c0",
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
        marginLeft: 10,
        color: '#000', // Black text for light mode
      },
      darkTextInput: {
        marginLeft: 10,
        color: '#fff', // White text for dark mode
      },
});
