import { getFirestore, collection, query, where, getDocs, addDoc, setDoc, doc, updateDoc, orderBy, getDoc } from "firebase/firestore";
import { auth } from "$lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { v4 as uuidv4 } from 'uuid'; 

const db = getFirestore();

export const fetchTasksForUser = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userId = user.uid;
          const tasksCollectionRef = collection(db, `tasks`);

          const querySnapshot = await getDocs(query(tasksCollectionRef, where('userId', '==', userId)));

          const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

          resolve(data);
        } else {
          console.warn("User is not authenticated");
          resolve([]);
        }
      });
    } catch (error) {
      console.error("Error listening for authentication state changes:", error);
      reject(error);
    }
  });
};

export const addTask = async (
  /** @type {string} */ title,
  /** @type {string} */ description,
  /** @type {string} */ difficulty
) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User is not authenticated.");
    }

    const userId = user.uid;
    const tasksCollectionRef = collection(db, 'tasks');

    // Fetch the username from the user's document
    const userDocRef = doc(db, 'users', userId);
    const userDocSnapshot = await getDoc(userDocRef);

    if (!userDocSnapshot.exists()) {
      throw new Error("User not found in 'users' collection");
    }

    const username = userDocSnapshot.data().username;

    // Add the new task document to the collection
    const newTaskRef = await addDoc(tasksCollectionRef, {
      userId,
      username,
      title,
      description,
      difficulty,
      createdAt: new Date(),
      completed: false,
    });

    // Fetch the newly created task details including ID
    const newTaskDocSnapshot = await getDoc(newTaskRef);

    if (!newTaskDocSnapshot.exists()) {
      throw new Error("Newly created task document not found");
    }

    const newTaskData = { id: newTaskDocSnapshot.id, ...newTaskDocSnapshot.data() };

    console.log("Task added successfully.");
    return newTaskData;
  } catch (error) {
    console.error("Error adding task:", error);
    throw error; // Rethrow to let the caller handle it
  }
};



export const editTask = async (/** @type {string | undefined} */ taskId, /** @type {{ completed?: boolean; title?: string; }} */ newData) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User is not authenticated.");
    }

    const userId = user.uid;
    const tasksCollectionRef = collection(db, `tasks`);
    const taskDocRef = doc(tasksCollectionRef, taskId);

    await updateDoc(taskDocRef, newData);

    console.log("Task updated successfully.");
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

/**
 * @typedef {Object} UserData
 * @property {string} userId
 * @property {string} username 
 * @property {number} totalPoints
 * @property {number} level
 */

/**
 * Calculate total points, level, and username for each user based on completed tasks.
 * @returns {Promise<UserData[]>} An array of user data objects.
 */
export const calculateUsersPointsAndLevels = async () => {
  try {
    const tasksCollectionRef = collection(db, 'tasks');
    const userCollectionRef = collection(db, 'users');

    const tasksQuerySnapshot = await getDocs(tasksCollectionRef);
    const userQuerySnapshot = await getDocs(userCollectionRef);

    // Create a map of usernames for efficient lookup
    const usernameMap = {};
    // @ts-ignore
    userQuerySnapshot.forEach(doc => usernameMap[doc.id] = doc.data().username);

    /** @type {Record<string, UserData>} */
    const usersData = {};

    for (const taskDoc of tasksQuerySnapshot.docs) {
      const { userId, completed } = taskDoc.data();

      if (!usersData[userId]) {
        usersData[userId] = { 
          userId, 
          // @ts-ignore
          username: usernameMap[userId], // Look up username
          totalPoints: 0, 
          level: 0 
        };
      }

      if (completed) {
        usersData[userId].totalPoints += 3;
      }
    }

    for (const userId in usersData) {
      usersData[userId].level = Math.floor(usersData[userId].totalPoints / 30) + 1;
    }

    const usersDataArray = Object.values(usersData);

    usersDataArray.sort((a, b) => b.totalPoints - a.totalPoints); // Sort in descending order

    return usersDataArray; 
  } catch (error) {
    console.error('Error calculating users\' points and levels:', error);
    throw error;
  }
};



export const calculateUserPointsAndLevel = async (/** @type {unknown} */ userId) => {
  try {
    const tasksCollectionRef = collection(db, `tasks`);
    const tasksQuerySnapshot = await getDocs(query(tasksCollectionRef, where('userId', '==', userId)));

    const totalPoints = tasksQuerySnapshot.docs.filter(doc => doc.data().completed).length * 3;
    const level = Math.floor(totalPoints / 30) + 1;

    return { totalPoints, level };
  } catch (error) {
    console.error('Error calculating user\'s points and level:', error);
    throw error;
  }
};

