// Date Formatter

// @ts-ignore
import firebase from "firebase/compat/app";

/**
 * Convert Firestore timestamp to a formatted date string.
 * @param {firebase.firestore.Timestamp} timestamp - Firestore timestamp object
 * @param {string} [format='full'] - Format of the output date string ('full', 'time', 'date')
 * @returns {string} Formatted date string
 */
export function convertTimestamp(timestamp, format = 'full') {
    const date = timestamp.toDate();
    const mm = date.getMonth() + 1;
    const dd = date.getDate();
    const yyyy = date.getFullYear();
    const hh = date.getHours();
    const min = date.getMinutes();
    const ss = date.getSeconds();
  
    const formattedMM = mm < 10 ? `0${mm}` : mm;
    const formattedDD = dd < 10 ? `0${dd}` : dd;
    const formattedHH = hh < 10 ? `0${hh}` : hh;
    const formattedMin = min < 10 ? `0${min}` : min;
    const formattedSS = ss < 10 ? `0${ss}` : ss;
  
    switch (format) {
      case 'full':
        return `${formattedMM}/${formattedDD}/${yyyy} ${formattedHH}:${formattedMin}:${formattedSS}`;
      case 'time':
        return `${formattedHH}:${formattedMin}:${formattedSS}`;
      case 'date':
        return `${formattedMM}/${formattedDD}/${yyyy}`;
      default:
        return `${formattedMM}/${formattedDD}/${yyyy} ${formattedHH}:${formattedMin}:${formattedSS}`;
    }
  }
  