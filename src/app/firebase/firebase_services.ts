import { db, storage } from "./firebase";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile,signOut  } from "firebase/auth";
import { doc,collection,addDoc, setDoc , updateDoc, FieldValue, arrayUnion, getDoc, arrayRemove } from "firebase/firestore";
import { Anime } from "../types/anime_type";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";


interface UserProfile {
    userName: string;
    username: string;
    photoURL?: string;
    email: string;
    Plan_to_watch?: AnimeItem[];
    watching?: AnimeItem[];
    completed?: AnimeItem[];
    dropped?: AnimeItem[];
    'on-Hold'?: AnimeItem[];
  }
  
  interface AnimeItem {
    mal_id: number;
    title: string;
    type: string;
    status: string;
    rank: number;
    cover: string;
  }
class FirebaseServices{
    auth = getAuth();
    createUserData = async (userId : string, userName: string) => {
        try {
            //* get reference
            const docRef = doc(db, "users", userId)
            //* set data
            await setDoc(docRef, {"userName":userName,"watching":[],"on-Hold":[],"Plan_to_watch":[],"dropped":[],"completed":[]})
        } catch (error) {
            console.error("that's the problem boss: ", error)
        }
    }

    signUp = async (email: string, password: string, userName:string) => {
  try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
            displayName:userName
        })
    }
      //* add the email to emails list
      const docRef = doc(db, "emails", email); // Specify the collection and document ID
      await setDoc(docRef, { used: true, joined:Date.now() }); // Set the document data
      //* save user initial data
      this.createUserData(userCredential.user.uid, userName)
      //* return user
    return userCredential.user;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
}

    signIn = async (email: string, password: string) => {
  try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
    }
    

    updateListContent = async (listId: string, item: Anime, userId: string, isInTheList: boolean) => {
        try {
            //* get reference
            const docRef = doc(db, "users", userId);
            //* set data with dynamic field name
            await updateDoc(docRef, {
                [listId]: isInTheList? arrayRemove(Anime.toJson(item)) : arrayUnion(Anime.toJson(item))  // Using [] for dynamic field name
            });
            console.log("Item added to list successfully");
        } catch (error) {
            console.error("that's the problem boss: ", error);
        }
    };
    
    checkIfAnimeIsInList = async (animeId: string, userId: string) => {
        const resultMaps: Array<{ listName: string; exists: boolean }> = [];
        let isItTrue = false; // Flag to check if at least one anime exists
        const lists: Array<string> = ["Plan_to_watch", "completed", "dropped", "on-Hold", "watching"];
    
        try {
            const docRef = doc(db, "users", userId);
            const docSnap = await getDoc(docRef);
            console.log("let's gooo");
    
            if (docSnap.exists()) {
                console.log("correct madem");
                // Document data is available here as an object
                const data = docSnap.data();
                console.log("Document data:", data);
    
                for (const list of lists) {
                    // Get vars
                    console.log(data[list]);
                    
                    const isItemExist = data[list]?.some((anime: { mal_id: number }) => String(anime.mal_id) === animeId) || false;
    
                    // Push the result map for the current list
                    resultMaps.push({ listName: list, exists: isItemExist });
    
                    // Check if any item exists
                    if (isItemExist) {
                        isItTrue = true; // Set the flag to true if at least one exists
                    }
                }
            } else {
                // Document doesn't exist
                console.log("No such document!");
            }
        } catch (error) {
            console.error("--------->", error);
        }
    
        return { resultMaps, isItTrue }; // Return both the maps and the boolean
    };
    

    

    async getUserData(userId: string): Promise<UserProfile | null> {
        try {
          if (!userId) throw new Error('User ID is required');
          
          const docRef = doc(db, "users", userId);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            return {
              ...data,
              Plan_to_watch: data.Plan_to_watch || [],
              watching: data.watching || [],
              completed: data.completed || [],
              dropped: data.dropped || [],
              'on-Hold': data['on-Hold'] || []
            };
          }
          return null;
        } catch (error) {
          console.error('Error fetching user data:', error);
          throw error;
        }
      }
    
    async updateUserProfile(uid: string | null, profileData: Partial<UserProfile>): Promise<boolean> {
          console.log(profileData)
        try {
          if (!uid) throw new Error('User ID is required');
          
          const userRef = doc(db, "users", uid);
          await setDoc(userRef, profileData, { merge: true });
          
          return true;
        } catch (error) {
          console.error("Error updating user profile:", error);
          throw error;
        }
    }
    
    handleLogout = async () => {
        try {
          await signOut(this.auth);
          console.log("User signed out successfully");
            // You can also redirect the user or update the UI here
            return true
        } catch (error) {
            console.error("Error signing out: ", error);
            return false
        }
    };
    
    uploadImageAndUpdateUser = async (file: File, userId: string) => {
        if (!file || !userId) {
          throw new Error('File and userId must be provided');
        }
      
        const storageRef = ref(storage, `user-images/${userId}/${file.name}`);
        await uploadBytes(storageRef, file);
        
        const imageUrl = await getDownloadURL(storageRef);
      
        const userDocRef = doc(db, 'users', userId);
        await updateDoc(userDocRef, {
          imageUrl: imageUrl,
        });
      
        return imageUrl;
      };
}

export default FirebaseServices