export const convertToDateTime = (dateTimeString) => {
  // Parse the date-time string
  let date;
  if (dateTimeString.endsWith("Z")) {
    // If the date-time string ends with "Z", it's in UTC time
    date = new Date(dateTimeString);
  } else {
    // If there's no "Z", treat the time as local time
    date = new Date(dateTimeString + "Z");
  }

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  // Extract date components
  const day = ("0" + date.getUTCDate()).slice(-2);
  const month = ("0" + (date.getUTCMonth() + 1)).slice(-2);
  const year = date.getUTCFullYear();

  // Extract hours and minutes
  let hours = date.getUTCHours();
  const minutes = ("0" + date.getUTCMinutes()).slice(-2);

  // Determine AM/PM
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  // Format date and time
  const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;

  return formattedDateTime;
};
