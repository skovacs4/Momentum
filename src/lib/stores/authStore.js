import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateEmail, updatePassword } from "firebase/auth";
import { writable } from "svelte/store";
import { auth } from '$lib/firebase';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
const db = getFirestore();

export const authStore = writable({
    isLoading: true,
    currentUser: null
})

export const authHandlers = {
    login: async (/** @type {string} */ email, /** @type {string} */ password) => {
        await signInWithEmailAndPassword(auth, email, password)
    },
    signup: async (/** @type {string} */ email, /** @type {string} */ password, /** @type {string} */ username) => { // Add username parameter
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const userId = userCredential.user.uid;

            // Store username in Firestore
            const userRef = doc(db, 'users', userId);
            await setDoc(userRef, { 
                username, 
            });  

        } catch (err) {
            console.log(err);
        }
    },
    logout: async () => {
        await signOut(auth)
    },
    resetPassword: async (/** @type {string} */ email) => {
        if (!email) {
            console.log('inHERE')
            return
        }
        await sendPasswordResetEmail(auth, email)
    },
    updateEmail: async (/** @type {string} */ email) => {
        authStore.update(curr => {
            return {
                ...curr, currentUser: {
                    // @ts-ignore
                    ...curr.currentUser, email: email
                }
            }
        })
        // @ts-ignore
        await updateEmail(auth.currentUser, email)
    },
    // @ts-ignore
    updatePassword: async (password) => {
        // @ts-ignore
        await updatePassword(auth.currentUser, password)
    }
}