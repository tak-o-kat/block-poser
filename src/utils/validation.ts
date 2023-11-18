import { isValidAddress } from "algosdk";
import { convertTime12to24 } from './helperFunctions';


// helper function to set the error obj for a single field
const setErrorState = (state: any, setState: any, name: string, obj: any) => {
  setState({...state, 
    errors: {
      ...state.errors,
      [name]: obj
    }
  });
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
  let startTimeFormatError = false;
  let isStartDateAfterEndDate = false;
  let startDate = state.fields.startDate;
  let startTime = state.fields.startTime;
  let endDate = state.fields.endDate;
  let endTime = state.fields.endTime;

  const emptyStartDateMsg = 'Start date is required!';
  const emptyStartTimeMsg = 'Start time is required!';
  const startDateAfterEndDateMsg = "Start date is not allowed to be after end date!"
  const startTimeAfterEndTimeMsg = 'Start time after End Time';
  const startDateAttributeName = 'startDate';
  const startTimeAttributeName = 'startTime';
  const endDateAttributeName = 'endDate';
  const endTimeAttributeName = 'endTime';
  const startTimeFormatErrMsg = 'Start time field is improperly formatted';
  const endTimeFormatErrMsg = 'End time field is improperly formatted'
  let dateField = {};
  let timeField = {};

  let runningBoolean = false

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
  if (startDateFieldError || startTimeFieldError) runningBoolean = runningBoolean || true;


  // *** Check both time fields to make sure they are complete
  if(!startTimeFieldError) {
    const [startHour, startMiniutes, startType] = state.fields.startTime.split(/[\s:]+/);
    const [endHour, endMinutes, endType] = state.fields.endTime.split(/[\s:]+/);

    const startTimeFormatError = isNaN(startHour) || isNaN(startMiniutes);
    const endTimeFormatError = isNaN(endHour) || isNaN(endMinutes);

    timeField = {
      error: startTimeFormatError,
      msg: startTimeFormatError ? startTimeFormatErrMsg : ''
    }

    setErrorState(state, setState, startTimeAttributeName, timeField);
    
    timeField = {
      error: endTimeFormatError,
      msg: endTimeFormatError ? endTimeFormatErrMsg : ''
    }

    setErrorState(state, setState, endTimeAttributeName, timeField);

    if (startTimeFormatError || endTimeFormatError) runningBoolean = runningBoolean || true;
  }
  
  
  // *** check if start date if comes after end date
  if (!startDateFieldError) {
    isStartDateAfterEndDate = startDate > endDate;

    // create start date after end date error object
    dateField = {
      error: isStartDateAfterEndDate,
      msg: isStartDateAfterEndDate ? startDateAfterEndDateMsg : ''
    }

    setErrorState(state, setState, startDateAttributeName, dateField);

    if (isStartDateAfterEndDate) runningBoolean = runningBoolean || true;
  }


  // *** if the dates are the same check to see if the start and end times make sense
  if (!runningBoolean && !startTimeFormatError && 
    state.fields.startDate === state.fields.endDate) {
    startTime = convertTime12to24(state.fields.startTime);
    endTime = convertTime12to24(state.fields.endTime);
    startTimeFieldError = startTime > endTime;

    timeField = {
      error: startTimeFieldError,
      msg: startTimeFieldError ? startTimeAfterEndTimeMsg : ''
    }

    setErrorState(state, setState, startTimeAttributeName, timeField);

    if (startTimeFieldError) runningBoolean = runningBoolean || true;
  }

  return runningBoolean;
}

export const errorsDetected = (state: any, setState: any): boolean => {
  // run each check
  const addressCheck = checkAccountAddress(state, setState);
  //const govPeriodCheck = checkGovPeriod(state, setState);
  const dateTimeCheck = checkDateTime(state, setState)

  return addressCheck || dateTimeCheck;
}
