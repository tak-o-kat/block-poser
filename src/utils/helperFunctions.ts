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
};

export const convertTime24to12 = (time24h: string) => {
  let [hours, minutes, seconds] = time24h.split(':');
  const modifier = (hours > '11' && hours < '24') ? 'PM' : 'AM'

  // convert hour to appropriate 12 hour digit
  hours = (parseInt(hours) % 12 === 0) ? '12' : (parseInt(hours) % 12).toString();
  return `${hours.length === 1 ? '0' + hours : hours}:${minutes}:${seconds} ${modifier}`;
};

// take an iso ordered date and return a date Americans can understand
export const isoToDisplayDate = (date: string) => {
  const [year, month, day] = date.split("-");
  return `${month}-${day}-${year}`;
}

// converts a display date to an iso ordered date
export const dateToIsoDate = (date: string) => {
  const [month, day, year] = date.split("-");
  return `${year}-${month}-${day}`;
}

export const getSplitDates = (date: string) => {
  return date.split("-").map((n: string) => parseInt(n));
}

export const getSplitTime = (date: string) => {
  return date.split(":").map((n: string) => parseInt(n));
}


// function to save form state to local storage 
export const saveSessionData = (state: any) => {
  sessionStorage.setItem('formState', JSON.stringify(state));
}

export const restoreSessionData = () => {
  return JSON.parse(sessionStorage.getItem('formState'));
}