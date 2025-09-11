export const toMinutes = (time: string): number => {
  // e.g., "09:00 AM" or "02:30 PM"
  const [hourMin, meridiem] = time.split(' '); // ["09:00", "AM"]
  const [hoursRaw, minutes] = hourMin.split(':').map(Number);

  let hours = hoursRaw;
  if (meridiem?.toUpperCase() === 'PM' && hours !== 12) {
    hours += 12;
  }
  if (meridiem?.toUpperCase() === 'AM' && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
};
