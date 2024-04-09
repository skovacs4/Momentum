import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc, // Import doc function
  updateDoc, // Import updateDoc function
  query,
  orderBy,
  onSnapshot,
  where,
  setDoc,
  // @ts-ignore
} from "firebase/firestore";
import { auth } from "$lib/firebase";
// @ts-ignore
import { onAuthStateChanged } from "firebase/auth";

// Initialize Firestore
const db = getFirestore();

// Function to fetch data from the database
export const fetchTasks = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "Tasks"));
    const data = querySnapshot.docs.map(
      (/** @type {{ data: () => any; }} */ doc) => doc.data()
    );
    return data;
  } catch (error) {
    console.error("Error fetching data from database:", error);
    return null;
  }
};

// Function to fetch tasks from the user's specific collection
export const fetchTasksForUser = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      // Start listening for authentication state changes
      // @ts-ignore
      const unsubscribe = onAuthStateChanged(
        auth,
        // @ts-ignore
        async (/** @type {{ uid: any; }} */ user) => {
          if (user) {
            // User is authenticated, fetch tasks for the user
            const userId = user.uid;
            const tasksCollectionRef = collection(db, `users/${userId}/tasks`);
            try {
              // Get the documents in the collection
              const querySnapshot = await getDocs(tasksCollectionRef);

              // Include ID in the extracted data
              const data = querySnapshot.docs.map(
                (/** @type {{ id: any; data: () => any; }} */ doc) => ({
                  id: doc.id, // Include the document ID
                  ...doc.data(),
                })
              );

              // console.log("Tasks:", data);

              resolve(data); // Resolve with tasks data
            } catch (error) {
              console.error("Error fetching data from database:", error);
              reject(error); // Reject with error if fetching data fails
            } finally {
              // Unsubscribe from the auth state changes listener
              unsubscribe();
            }
          } else {
            // User is not authenticated
            console.warn("User is not authenticated");
            resolve([]); // Resolve with an empty array if user is not authenticated
          }
        }
      );
    } catch (error) {
      console.error("Error listening for authentication state changes:", error);
      reject(error); // Reject with error if listening for auth state changes fails
    }
  });
};

// Function to add a new task to the database
export const addTask = async (
  /** @type {any} */ title,
  /** @type {any} */ description,
  /** @type {any} */ difficulty
) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User is not authenticated.");
    }

    const userId = user.uid;
    const tasksCollectionRef = collection(db, `users/${userId}/tasks`);
    // Add the new task document to the collection
    await addDoc(tasksCollectionRef, {
      title,
      description,
      difficulty,
      createdAt: new Date(),
      completed: false,
    });

    console.log("Task added successfully.");
  } catch (error) {
    console.error("Error adding task:", error);
    throw error;
  }
};

// Function to update data in the database
export const editTask = async (
  /** @type {string} */ taskId,
  /** @type {object} */ newData
) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User is not authenticated.");
    }

    const userId = user.uid;
    const tasksCollectionRef = collection(db, `users/${userId}/tasks`);

    // Reference to the specific task document
    const taskDocRef = doc(tasksCollectionRef, taskId);

    // Update the task document with new data
    await updateDoc(taskDocRef, newData);

    console.log("Task updated successfully.");
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

// Function to add a new task to the database
export const fetchCharacter = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      // Start listening for authentication state changes
      // @ts-ignore
      const unsubscribe = onAuthStateChanged(
        auth,
        // @ts-ignore
        async (/** @type {{ uid: any; }} */ user) => {
          if (user) {
            // User is authenticated, fetch tasks for the user
            const userId = user.uid;
            const characterCollectionRef = collection(
              db,
              `users/${userId}/character`
            );
            try {
              // Get the documents in the collection
              const querySnapshot = await getDocs(characterCollectionRef);

              // Include ID in the extracted data
              const data = querySnapshot.docs.map(
                (/** @type {{ id: any; data: () => any; }} */ doc) => ({
                  id: doc.id, // Include the document ID
                  ...doc.data(),
                })
              );

              // console.log("Tasks:", data);

              resolve(data); // Resolve with tasks data
            } catch (error) {
              console.error("Error fetching data from database:", error);
              reject(error); // Reject with error if fetching data fails
            } finally {
              // Unsubscribe from the auth state changes listener
              unsubscribe();
            }
          } else {
            // User is not authenticated
            console.warn("User is not authenticated");
            resolve([]); // Resolve with an empty array if user is not authenticated
          }
        }
      );
    } catch (error) {
      console.error("Error listening for authentication state changes:", error);
      reject(error); // Reject with error if listening for auth state changes fails
    }
  });
};

// Function to calculate total points and levels for all users
export const calculateUsersPointsAndLevels = async () => {
  try {
    const usersCollectionRef = collection(db, 'users');
    const usersQuerySnapshot = await getDocs(usersCollectionRef);

     // Log all user documents
     console.log("User documents:");
     usersQuerySnapshot.forEach(doc => {
       console.log(doc.id, '=>', doc.data());
     });

    const usersData = [];

    if (usersQuerySnapshot.empty) {
       throw new Error("No user data found.");
    }

    // Iterate over each user document
    for (const userDoc of usersQuerySnapshot.docs) {
      const userId = userDoc.id;
      console.log('Processing user:', userId); // Log user ID

      const tasksCollectionRef = collection(db, `users/${userId}/tasks`);

      // Query all tasks for the current user
      const tasksQuerySnapshot = await getDocs(tasksCollectionRef);

      // Calculate total points for the user (each completed task contributes a fixed number of points)
      const totalPoints = tasksQuerySnapshot.docs
        .filter(doc => doc.data().completed) // Filter completed tasks
        .length * 3; // Each completed task contributes 3 points

      // Calculate user's level based on total points (30 points per level)
      const level = Math.floor(totalPoints / 30) + 1;

      // Build user data object with points and level
      const userData = {
        userId,
        totalPoints,
        level,
      };

      usersData.push(userData);
    }

    return usersData;
  } catch (error) {
    console.error('Error calculating users\' points and levels:', error);
    throw error;
  }
};

// Add completed tasks to leaderboard
/**
 * @param {string} userId
 * @param {any} totalPoints
 * @param {any} level
 */
// Define an async function to update the leaderboard in Firestore
export async function updateLeaderboard(userId, totalPoints, level) {
  try {
    const db = getFirestore(); // Get Firestore instance
    const leaderboardRef = doc(db, 'leaderboard', userId); // Reference to the leaderboard document

    // Set the leaderboard document with the provided data
    await setDoc(leaderboardRef, {
      userId,
      totalPoints,
      level
    });

    console.log("Leaderboard updated successfully!");
  } catch (error) {
    console.error("Error updating leaderboard:", error);
    throw error; // Rethrow the error to handle it upstream
  }
}

export const fetchLeaderboard = async () => {
  const db = getFirestore();
  const leaderboardRef = collection(db, 'leaderboard');

  // Order leaderboard entries by totalPoints (descending)
  // @ts-ignore
  const query = orderBy(leaderboardRef, 'totalPoints', 'desc'); 

  // @ts-ignore
  const querySnapshot = await getDocs(query);
  const leaderboardData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

  return leaderboardData;  
}
