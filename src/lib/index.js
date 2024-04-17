// place files you want to import through the `$lib` alias in this folder.

// Utilities

/**
 * @param {{ toDate: () => any; }} timestamp
 */
function convertTimestamp(timestamp, format = "full") {
    let date = timestamp.toDate(); // Convert Firestore timestamp to JavaScript Date object
    let mm = date.getMonth() + 1; // Get month (adding 1 because getMonth() returns zero-based index)
    let dd = date.getDate(); // Get day of the month
    let yyyy = date.getFullYear(); // Get full year
    let hh = date.getHours(); // Get hours (in 24-hour format)
    let min = date.getMinutes(); // Get minutes
    let ss = date.getSeconds(); // Get seconds

    // Ensure mm, dd, hh, min, and ss are formatted with leading zeros if necessary
    let formattedMM = mm < 10 ? "0" + mm : mm;
    let formattedDD = dd < 10 ? "0" + dd : dd;
    let formattedHH = hh < 10 ? "0" + hh : hh;
    let formattedMin = min < 10 ? "0" + min : min;
    let formattedSS = ss < 10 ? "0" + ss : ss;

    // Construct the formatted date string based on the format argument
    switch (format) {
      case "full":
        return `${formattedMM}/${formattedDD}/${yyyy} ${formattedHH}:${formattedMin}:${formattedSS}`;
      case "time":
        return `${formattedHH}:${formattedMin}:${formattedSS}`;
      case "date":
        return `${formattedMM}/${formattedDD}/${yyyy}`;
      default:
        // If an invalid format argument is provided, return the full date by default
        return `${formattedMM}/${formattedDD}/${yyyy} ${formattedHH}:${formattedMin}:${formattedSS}`;
    }
  }