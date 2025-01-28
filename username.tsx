import { StyleSheet, View, Text, Image, Modal } from 'react-native'
import React, { useRef, useState } from 'react'
//import { Ionicons } from '@expo/vector-icons'
//import Entypo from '@expo/vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity, GestureHandlerRootView, TextInput, ScrollView } from 'react-native-gesture-handler'
import { auth, firestore } from '../firebase'
import { doc, query, setDoc, where, collection, getDocs } from 'firebase/firestore';
import { useTheme } from "@/components/ThemeContext";
import { useRouter } from "expo-router";

export default function username() {
    const { isLightScheme } = useTheme();
    const themeTextStyle = isLightScheme ? styles.lightThemeText : styles.darkThemeText;
    const themeContainerStyle = isLightScheme ? styles.lightContainer : styles.darkContainer;
    const themeTextInputStyle = isLightScheme
    ? [styles.inputLight, styles.lightTextInput]
    : [styles.inputDark, styles.darkTextInput];
    const router = useRouter();

    const [username, setUsername] = useState(''); // New state for username
    const [buttonPressed, setButtonPressed] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false); // State for modal visibility
    const [error, setError] = useState(''); // To manage and display error messages
    const usernameInputRef = useRef(null);

    //Ensure unique username
    const checkUsernameAvailability = async (username: string) => {
        try {
            const q = query(collection(firestore, 'users'), where('username', '==', username));
            const querySnapshot = await getDocs(q);
            return querySnapshot.empty; // Returns true if username is available
        } catch (error) {
            console.error('Error checking username availability:', error);
            setError('Error checking username availability.');
            return false;
        }
    }

    //const handleUsernameSelect = async () => {}
    {/*     */}
    const handleUsernameSelect = async () => {
        const user = auth.currentUser;
        if (user){
            if (!username) {
                setError('Username is required');
                setModalVisible(true);
                return;
            }

            const isAvailable = await checkUsernameAvailability(username);
            if (!isAvailable) {
                setError('Username is already taken');
                setModalVisible(true); // Show modal for non-unique username
                return;
            }

            if (user) {
            const username_lowercase = username.toLowerCase();
                try {
                    await setDoc(doc(firestore, 'users', user.uid), {
                        username: username_lowercase,
                        email: user.email, // Ensure email is available in Firestore
                        selectedSong: null
                    });
                    setError('');
                    const currentDate = new Date().toDateString(); // Only get the date part
                    const userUID = user.uid; // Get the logged-in user's UID
                    await AsyncStorage.setItem(`${userUID}_lastLoginDate`, currentDate);
                    router.replace('/enterSong')
                } catch (error) {
                    console.error('Error saving username:', error);
                    setError('Error saving username');
                    setModalVisible(true); 
                }
            } else {
                setError('User not authenticated');
                setModalVisible(true);
            }
        } else {
            setError('User not authenticated.');
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
            {/* Logo */}
            <View style={styles.imageContainer}>
                <Image source={require('@/assets/images/logo_only.png')} style={styles.logo} />
            </View>
            {/* Main Text */}
            <View style={styles.mainTextContainer}>
                <Text style={themeTextStyle}>Welcome to Jam!</Text>
            </View>
            {/* Enter Username */}
            <View style={styles.inputContainer}>
            <TextInput
                      style={themeTextInputStyle}
                      value={username}
                      onChangeText={text => setUsername(text.replace(/\s/g, ''))}
                      placeholder="Username"
                      placeholderTextColor={isLightScheme ? "#A9A9A9" : "#505050"}
                      autoCapitalize="none"
                      returnKeyType="done" // Show "Done" button on the keyboard
                      ref={usernameInputRef} // Use the reference for focusing
                      onSubmitEditing={() => handleUsernameSelect()} // Trigger login when "Done" is pressed
                  />
          </View>
            {/* Confirm Button */}
            <TouchableOpacity style={styles.buttonContainer} onPress={() => handleUsernameSelect()}>
                <Text style={{ color: 'white' }}>Select Username</Text>
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
})