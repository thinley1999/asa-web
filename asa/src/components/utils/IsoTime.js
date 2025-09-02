export const isoToTime = (input) => {
  if (!input) return "Invalid Time";

  // Normalize to a string
  const s =
    input instanceof Date ? input.toISOString() : String(input);

  // If there's no explicit offset, assume UTC (append "Z")
  const hasOffset = /Z$|[+-]\d{2}:\d{2}$/.test(s);
  const date = new Date(hasOffset ? s : s + "Z");

  if (isNaN(date.getTime())) return "Invalid Time";

  // Use UTC to avoid local-time shifts
  let hours = date.getUTCHours();
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12; // 0 -> 12
  const hh = String(hours).padStart(2, "0");

  return `${hh}:${minutes} ${ampm}`;
};
