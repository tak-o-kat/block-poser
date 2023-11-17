

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

export const convertTime24to12 = (time24h: string) => {
  let [hours, minutes, seconds] = time24h.split(':');
  const modifier = (hours > '11' && hours < '24') ? 'PM' : 'AM'

  // convert hour to appropriate 12 hour digit
  hours = (parseInt(hours) % 12 === 0) ? '12' : (parseInt(hours) % 12).toString();
  return `${hours.length === 1 ? '0' + hours : hours}:${minutes}:${seconds} ${modifier}`;
}