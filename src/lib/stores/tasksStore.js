// tasksStore.js

import { writable } from "svelte/store";
import { notificationType } from "./notificationsStore";

// Define writable store for selected task
export const selectedTaskStore = writable(null);

// Define writable store for selected task
export const selectedTaskStoreSecond = writable(null);

// Define writable store for selected task
export const tasksStore = writable([]);

// Initial values
// export const userStatsStore = writable({
//     totalPoints: 0,
//     level: 1,
//     pointsPerLevel: 30
// });

// Define writable store for selected task
export const historyTasks = writable([]);

// Define writable store for userStats
export const userStatsStore = (() => {
  // Create the underlying writable store
  const { subscribe, set, update } = writable({
    totalPoints: 0,
    level: 1,
    pointsPerLevel: 30
  });

  // Subscribe to userStatsStore and listen for changes
  const unsubscribe = subscribe((stats) => {
    // Check for level milestones and trigger notifications
    if (stats.level % 30 === 0 && stats.totalPoints >= stats.level * stats.pointsPerLevel) {
      // @ts-ignore
      notificationType.set(4); // Trigger congratulations notification for milestone level
    }
  });

  // Return the writable store with additional functionality
  return {
    subscribe,
    set,
    update,
    unsubscribe // Provide access to unsubscribe function
  };
})();