

// helper function to convert 12 hour time to 24 hour time
export const convertTime12to24 = (time12h: string) => {
  const [time, modifier] = time12h.split(' ');

  let [hours, minutes, seconds] = time.split(':');
  if (hours === '12') {
      hours = '00';
  }

  if (modifier === 'PM') {
      hours = (parseInt(hours, 10) + 12).toString();
  }

  return `${hours}:${minutes}:${seconds === undefined ? '00': seconds}`;
}