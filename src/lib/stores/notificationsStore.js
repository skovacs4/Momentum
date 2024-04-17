// stores/notificationStore.js

import { writable } from 'svelte/store';

// Initialize writable store for notification type
export const notificationType = writable(null);
