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
    const data = querySnapshot.docs.map((/** @type {{ data: () => any; }} */ doc) => doc.data());
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
      const unsubscribe = onAuthStateChanged(auth, async (/** @type {{ uid: any; }} */ user) => {
        if (user) {
          // User is authenticated, fetch tasks for the user
          const userId = user.uid;
          const tasksCollectionRef = collection(db, `users/${userId}/tasks`);
          try {
            // Get the documents in the collection
            const querySnapshot = await getDocs(tasksCollectionRef);

            // Include ID in the extracted data
            const data = querySnapshot.docs.map((/** @type {{ id: any; data: () => any; }} */ doc) => ({
              id: doc.id, // Include the document ID
              ...doc.data(),
            }));

            // Extract the data from the documents
            // const data = querySnapshot.docs.map((doc) => doc.data());

            console.log("Tasks:", data);

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
      });
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
  /** @type {any} */ difficulty,
  // @ts-ignore
  /** @type {boolean} */ completed,
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
      createdAt: new Date(), // Optionally include a createdAt timestamp
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
  /** @type {object} */ newData,
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

// Function to listen for real-time updates on tasks collection
export const listenForTaskUpdates = (
  /** @type {(arg0: any[]) => void} */ callback
) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User is not authenticated.");
  }

  const userId = user.uid;
  const tasksCollectionRef = collection(db, `users/${userId}/tasks`);
  const q = query(tasksCollectionRef, orderBy("createdAt", "desc"));

  // @ts-ignore
  return onSnapshot(q, (/** @type {any[]} */ snapshot) => {
    /**
     * @type {any[]}
     */
    const tasks = [];
    snapshot.forEach((/** @type {{ data: () => any; }} */ doc) => {
      tasks.push(doc.data());
    });
    callback(tasks);
  });
};
