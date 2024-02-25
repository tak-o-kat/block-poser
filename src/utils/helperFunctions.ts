// helper function to convert 12 hour time to 24 hour time
export const convertTime12to24 = (time12h: string) => {
  const [time, modifier] = time12h.split(" ");

  let [hours, minutes, seconds] = time.split(":");
  if (hours === "12") {
    hours = "00";
  }

  if (modifier === "PM") {
    hours = (parseInt(hours, 10) + 12).toString();
  }

  return `${hours}:${minutes}:${seconds === undefined ? "00" : seconds}`;
};

export const convertTime24to12 = (time24h: string) => {
  let [hours, minutes, seconds] = time24h.split(":");
  const modifier = hours > "11" && hours < "24" ? "PM" : "AM";

  // convert hour to appropriate 12 hour digit
  hours = parseInt(hours) % 12 === 0 ? "12" : (parseInt(hours) % 12).toString();
  return `${
    hours.length === 1 ? "0" + hours : hours
  }:${minutes}:${seconds} ${modifier}`;
};

// take an iso ordered date and return a date Americans can understand
export const isoToDisplayDate = (date: string) => {
  const [year, month, day] = date.split("-");
  return date !== "" ? `${month}-${day}-${year}` : "";
};

// converts a display date to an iso ordered date
export const dateToIsoDate = (date: string) => {
  const [month, day, year] = date.split("-");
  return date !== "" ? `${year}-${month}-${day}` : "";
};

export const getSplitDates = (date: string) => {
  return date.split("-").map((n: string) => parseInt(n));
};

export const getSplitTime = (date: string) => {
  return date.split(":").map((n: string) => parseInt(n));
};

// function to save form state to local storage
export const saveLocalData = (state: any) => {
  localStorage.setItem("formState", JSON.stringify(state));
};

export const restoreLocalData = () => {
  return JSON.parse(localStorage.getItem("formState"));
};

export const deleteLocalData = () => {
  localStorage.removeItem("formState");
};

// function to get the current governance period date, based on Singapore time
const getGovDate = () => {
  const currentDate = new Date();
  let date = currentDate.toISOString().slice(0, 10);
  const hour = parseInt(currentDate.toISOString().slice(11, 13));

  // Need to make a check on 12-31 @ 16:00 GMT (8 hour window) time to see if the new year has happened
  let [year, month, day] = getSplitDates(date);
  if (month === 12 && day === 31 && hour >= 16) {
    date = `${++year}-${"01"}-${"01"}`;
  }

  return date;
};

// This function will generate all the governance periods from the inital governance date
export const getGovernanceList = () => {
  const GOV_YEARLY_CHANGE_OVER_LIST = [
    // start with Sept - Dec as this was the first gov period
    {
      start: "-09-30",
      end: "-12-31",
    },
    {
      start: "-12-31",
      end: "-03-31",
    },
    {
      start: "-03-31",
      end: "-06-30",
    },
    {
      start: "-06-30",
      end: "-09-31",
    },
  ];

  const initGovYear = "2021";
  const currentGovDate = getGovDate();
  const [year, month, day] = getSplitDates(currentGovDate);

  let firtGovPeriod = 1; // takes into consideration Oct - Dec of 2021
  const yearsActive = year - (parseInt(initGovYear) + 1); // get num years governance has been running

  // Get the number of quarters that have currently happened in the current year
  const quartersThisYear = Math.ceil((month / 12) * 4);

  // Add up the years and current months
  const govPeriods = firtGovPeriod + yearsActive * 4 + quartersThisYear;
  const govPeriodList = [];
  let changeOverYear = parseInt(initGovYear);

  // generate a list of all the governance periods starting with the initial year
  for (let i = 0; i < govPeriods; i++) {
    // make an index using modulus to cycle through GOV_YEARLY_CHANGE_OVER_LIST
    let changeOverIndex = i % 4;

    // determine the year based on GOV_YEARLY_CHANGE_OVER_LIST
    changeOverYear =
      changeOverIndex === 1 ? changeOverYear + 1 : changeOverYear;

    govPeriodList.push({
      startDate: `${
        changeOverIndex === 1 ? changeOverYear - 1 : changeOverYear
      }${GOV_YEARLY_CHANGE_OVER_LIST[changeOverIndex].start}`,
      endDate: `${changeOverYear}${GOV_YEARLY_CHANGE_OVER_LIST[changeOverIndex].end}`,
    });
  }
  // get the total gov periods and return the last 4
  const govPeriodObject = {
    govPeriods: govPeriods,
    govPeriodList: govPeriodList.slice(-4),
  };
  return govPeriodObject;
};

// add language to local storage
export const saveLanguage = (lang: string) => {
  localStorage.setItem("lang", lang);
};

export const getLanguage = () => {
  return localStorage.getItem("lang");
};

// function used to get the object to initialize i18next
export const getI18NextConfig = () => {
  // check and see if local storage has a default set
  const resp = getLanguage();
  const lang = resp === null ? "en-US" : resp;

  // save default lang
  saveLanguage(lang);

  return {
    lng: lang,
    debug: false,
    interpolation: {
      escapeValue: true,
    },
    fallbackLng: "en-US",
    ns: "translation",
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
  };
};
