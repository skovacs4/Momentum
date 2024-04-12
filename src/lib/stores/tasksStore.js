// tasksStore.js

import { writable } from "svelte/store";

// Define writable store for selected task
export const selectedTaskStore = writable(null);

// Define writable store for selected task
export const selectedTaskStoreSecond = writable(null);

// Define writable store for selected task
export const tasksStore = writable([]);