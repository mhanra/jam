import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { auth, firestore } from '@/firebase';
import { doc, collection, addDoc, getDocs, getDoc, query, where } from 'firebase/firestore';
import { useTheme } from '@/components/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function commentsScreen() {
    const { isLightScheme } = useTheme();
    const themeTextStyle = isLightScheme ? styles.lightThemeText : styles.darkThemeText;
    const themeContainerStyle = isLightScheme ? styles.lightContainer : styles.darkContainer;
    const themeBottomBorderStyle = isLightScheme ? styles.lightBottomBorder : styles.darkBottomBorder;
    const themeTextInputStyle = isLightScheme
    ? [styles.inputLight, styles.lightTextInput]
    : [styles.inputDark, styles.darkTextInput];
    const themeSearchBarBorder = isLightScheme
    ? styles.searchBarBorderLight 
    : styles.searchBarBorderDark;
  
    const router = useRouter();
    const { userId, songId } = useLocalSearchParams(); // Get userId from route parameters

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [username, setUsername] = useState('');
    const user = auth.currentUser;

    // Get today's date as a string
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(date.getDate()).padStart(2, '0');
  const currentDate = `${year}-${month}-${day}`;

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          const userDoc = doc(firestore, 'users', user.uid);
          const userSnapshot = await getDoc(userDoc);
          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            setUsername(userData.username);
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchUserData();
    }
  }, [user]);

  // Fetch comments for the selected song of the user for today
  const fetchComments = async () => {
    try {
      const commentsCollection = collection(firestore, 'users', userId, 'selectedSong', songId, 'comments');
      const commentsQuery = query(commentsCollection, where('date', '==', currentDate)); // Fetch comments only for today
      const commentsSnapshot = await getDocs(commentsQuery);
      const commentsList = commentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(commentsList);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    fetchComments(); // Fetch comments whenever songId or currentDate changes
  }, [songId, currentDate]);
  
  // Handle adding a new comment
  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        const commentsCollection = collection(firestore, 'users', userId, 'selectedSong', songId, 'comments');
        await addDoc(commentsCollection, {
          text: newComment,
          date: currentDate,  // Store the current date as a field
          createdAt: new Date(),
          createdBy: username,
        });
        setNewComment('');
        fetchComments(); // Fetch updated comments after adding
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  return (
    <KeyboardAvoidingView 
        style={[styles.container, themeContainerStyle]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        keyboardVerticalOffset={60} // Adjust based on your header height
    >
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => (
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="blue" />
                </TouchableOpacity>  
                <Text style={[styles.title, themeTextStyle]}>Comments</Text> 
            </View> 
          )}
        renderItem={({ item }) => (
          <View style={[styles.comment, themeBottomBorderStyle]}>
            <Text style={themeTextStyle}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={{ flexGrow: 1 }}
        ListFooterComponent={() => (
            <View style={styles.footer}>
                <TextInput
                    style={[styles.input, themeTextStyle, themeSearchBarBorder]}
                    placeholder="Add a comment..."
                    placeholderTextColor={isLightScheme ? "#A9A9A9" : "#505050"}
                    value={newComment}
                    onChangeText={setNewComment}
                />
                <TouchableOpacity style={styles.button} onPress={() => handleAddComment()}>
                    <Text style={{color: 'white'}}>Post</Text>
                </TouchableOpacity>  
            </View>
          )}
      />
    </KeyboardAvoidingView>   
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  headerContainer: {
    marginBottom: 10,
    alignItems: 'center', 
    justifyContent: 'center',
    },
    title: {
        marginTop: 15,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    backButton: {
        position: 'absolute',
        top: 20, 
        left: 20,
        zIndex: 1,
    },
  comment: {
    padding: 10,
    borderBottomWidth: 1,
  },
  input: {
    padding: 10,
    //marginBottom: 10,
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  footer: {
    paddingBottom: 10,
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#f34727',
    borderRadius: 4,
    marginLeft: 10,
    padding: 10,
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
    color: 'black', // Black text for light mode
  },
  darkTextInput: {
    color: '#fff', // White text for dark mode
  },
  lightBottomBorder: {
    borderBottomColor: '#242c40',
  },
  darkBottomBorder: {
    borderBottomColor: "#d0d0c0",
  },
  searchBarBorderLight: {
    borderColor:  "#242c40",
},
searchBarBorderDark: {
    borderColor: '#ddd',
},
})