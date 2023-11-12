import { isValidAddress } from "algosdk"

// helper function to set the error obj for a single field
const setErrorState = (state: any, setState: any, name: string, obj: any) => {
  setState({...state, 
    errors: {
      ...state.errors,
      [name]: obj
    }
  });
}

// helper function to convert 12 hour time to 24 hour time
const convertTime12to24 = (time12h: string) => {
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

const checkAccountAddress = (state: any, setState: any): boolean => {
  let emptyFieldError = false;
  let invalidAddressError = false;
  const emptyFieldMsg = "Node address required!";
  const invalidAddressMsg = "Not a valid account address!";
  const attributeName = "accountAddress";

  // check if the field is empty
  emptyFieldError = state.fields.accountAddress === '';
  
  // check if the field has a valid address, skip if field is empty
  invalidAddressError = !emptyFieldError && !isValidAddress(state.fields.accountAddress);

  // create the error obj
  const fields = {
    error: emptyFieldError || invalidAddressError,
    msg: emptyFieldError ? emptyFieldMsg : (invalidAddressError ? invalidAddressMsg: ''),
  }

  setErrorState(state, setState, attributeName, fields);
  return emptyFieldError || invalidAddressError;
}

const checkGovPeriod = (state: any, setState: any): boolean => {
  let govPeriodError = false;
  const noSelectErrorMsg = "Goverance period required!";
  const attributeName = "govPeriod";

  // Check if the select value is empty
  govPeriodError = state.fields.govPeriod === '';

  const fields = {
    error: govPeriodError,
    msg: govPeriodError ? noSelectErrorMsg : '',
  }
  
  setErrorState(state, setState, attributeName, fields);
  return govPeriodError;
};

const checkDateTime = (state: any, setState: any) => {
  let startDateFieldError = false;
  let startTimeFieldError = false;
  let isStartDateAfterEndDate = false;
  let startDate = state.fields.startDate;
  let startTime = state.fields.startTime;
  let endDate = state.fields.endDate;
  let endTime = state.fields.endTime;

  const emptyStartDateMsg = 'Start date is required!';
  const emptyStartTimeMsg = 'Start time is required!';
  const startDateAfterEndDateMsg = "Start date is not allowed to be after end date!"
  const startTimeAfterEndTimeMsg = 'Start time is not allowed to be after the end time on the same day!';
  const startDateAttributeName = 'startDate';
  const startTimeAttributeName = 'startTime';
  let dateField = {};
  let timeField = {};

  // *** check if start date and time fields are empty, we dont ahve to worry about
  // end date and time fields because defaults are provided
  startDateFieldError = state.fields.startDate === '';
  startTimeFieldError = state.fields.startTime === '';
  
  // create date and time error object
  dateField = {
    error: startDateFieldError,
    msg: startDateFieldError ? emptyStartDateMsg : ''
  }

  timeField = {
    error: startTimeFieldError,
    msg: startTimeFieldError ? emptyStartTimeMsg : ''
  }

  // set the fields
  setErrorState(state, setState, startDateAttributeName, dateField);
  setErrorState(state, setState, startTimeAttributeName, timeField);

  // if either field has an error return true
  if (startDateFieldError || startTimeFieldError) return true;


  // *** check if start date if comes after end date
  isStartDateAfterEndDate = startDate > endDate;

  // create start date after end date error object
  dateField = {
    error: isStartDateAfterEndDate,
    msg: isStartDateAfterEndDate ? startDateAfterEndDateMsg : ''
  }

  if (isStartDateAfterEndDate) return true;


  // *** if the dates are the same check to see if the start and end times make sensce
  startTime = convertTime12to24(state.fields.startTime);
  endTime = convertTime12to24(state.fields.endTime);
  startTimeFieldError = startTime > endTime;

  timeField = {
    error: startTimeFieldError,
    msg: startTimeFieldError ? startTimeAfterEndTimeMsg : ''
  }

  setErrorState(state, setState, startTimeAttributeName, timeField);

  if (startTimeFieldError) return true

  // Check both time fields to make sure they are complete

  return false;
}

export const errorsDetected = (state: any, setState: any): boolean => {
  // run each check
  const addressCheck = checkAccountAddress(state, setState);
  const govPeriodCheck = checkGovPeriod(state, setState);
  const dateTimeCheck = checkDateTime(state, setState)

  return addressCheck
}
