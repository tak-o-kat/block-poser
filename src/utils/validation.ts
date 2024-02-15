import { isValidAddress } from "algosdk";
import { convertTime12to24 } from "./helperFunctions";
import { type TFunction } from "i18next";

// helper function to set the error obj for a single field
const setErrorState = (state: any, setState: any, name: string, obj: any) => {
  setState({
    ...state,
    errors: {
      ...state.errors,
      [name]: obj,
    },
  });
};

const removeNFDState = (state: any, setState: any) => {
  setState({
    ...state,
    fields: {
      ...state.fields,
      isNFD: false,
    },
  });
};

/** The following functions check the validity of form fields */
const checkAccountAddress = (
  state: any,
  setState: any,
  t: TFunction<"translation", undefined>
): boolean => {
  let emptyFieldError = false;
  let invalidAddressError = false;
  const emptyFieldMsg = "Node address required!";
  const invalidAddressMsg = t("form_errors.address.invalid"); //"Invalid account address or NFD!";
  const attributeName = "accountAddress";

  // check if the field is empty
  emptyFieldError = state.fields.accountAddress === "";

  // check if the field has a valid address, skip if field is empty
  invalidAddressError =
    !emptyFieldError && !isValidAddress(state.fields.accountAddress);

  // create the error obj
  const fields = {
    error: emptyFieldError || invalidAddressError,
    msg: emptyFieldError
      ? emptyFieldMsg
      : invalidAddressError
      ? invalidAddressMsg
      : "",
  };

  setErrorState(state, setState, attributeName, fields);

  // if there are no errors, then we can safely say this is not an NFD address and remove the flag
  if (!invalidAddressError) removeNFDState(state, setState);
  return emptyFieldError || invalidAddressError;
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

  const emptyStartDateMsg = "Start date is required!";
  const emptyStartTimeMsg = "Start time is required!";
  const startDateAfterEndDateMsg = "Start date after end date!";
  const startTimeAfterEndTimeMsg = "Start time after End Time";
  const startDateAttributeName = "startDate";
  const startTimeAttributeName = "startTime";
  const endDateAttributeName = "endDate";
  const endTimeAttributeName = "endTime";
  const startTimeFormatErrMsg = "Start time field is improperly formatted";
  const endTimeFormatErrMsg = "End time field is improperly formatted";
  let dateField = {};
  let timeField = {};

  let runningBoolean = false;

  // *** check if start date and time fields are empty, we dont ahve to worry about
  // end date and time fields because defaults are provided
  startDateFieldError = state.fields.startDate === "";
  startTimeFieldError = state.fields.startTime === "";

  // create date and time error object
  dateField = {
    error: startDateFieldError,
    msg: startDateFieldError ? emptyStartDateMsg : "",
  };

  timeField = {
    error: startTimeFieldError,
    msg: startTimeFieldError ? emptyStartTimeMsg : "",
  };

  // set the fields
  setErrorState(state, setState, startDateAttributeName, dateField);
  setErrorState(state, setState, startTimeAttributeName, timeField);

  // if either field has an error return true
  if (startDateFieldError || startTimeFieldError)
    runningBoolean = runningBoolean || true;

  // *** Check both time fields to make sure they are complete
  if (!startTimeFieldError) {
    const [startHour, startMiniutes, startType] =
      state.fields.startTime.split(/[\s:]+/);
    const [endHour, endMinutes, endType] = state.fields.endTime.split(/[\s:]+/);

    const startTimeFormatError = isNaN(startHour) || isNaN(startMiniutes);
    const endTimeFormatError = isNaN(endHour) || isNaN(endMinutes);

    timeField = {
      error: startTimeFormatError,
      msg: startTimeFormatError ? startTimeFormatErrMsg : "",
    };

    setErrorState(state, setState, startTimeAttributeName, timeField);

    timeField = {
      error: endTimeFormatError,
      msg: endTimeFormatError ? endTimeFormatErrMsg : "",
    };

    setErrorState(state, setState, endTimeAttributeName, timeField);

    if (startTimeFormatError || endTimeFormatError)
      runningBoolean = runningBoolean || true;
  }

  // *** check if start date if comes after end date
  if (!startDateFieldError) {
    isStartDateAfterEndDate = startDate > endDate;

    // create start date after end date error object
    dateField = {
      error: isStartDateAfterEndDate,
      msg: isStartDateAfterEndDate ? startDateAfterEndDateMsg : "",
    };

    setErrorState(state, setState, startDateAttributeName, dateField);

    if (isStartDateAfterEndDate) runningBoolean = runningBoolean || true;
  }

  // *** if the dates are the same check to see if the start and end times make sense
  if (
    !runningBoolean &&
    !startTimeFormatError &&
    state.fields.startDate === state.fields.endDate
  ) {
    startTime = convertTime12to24(state.fields.startTime);
    endTime = convertTime12to24(state.fields.endTime);
    startTimeFieldError = startTime > endTime;

    timeField = {
      error: startTimeFieldError,
      msg: startTimeFieldError ? startTimeAfterEndTimeMsg : "",
    };

    setErrorState(state, setState, startTimeAttributeName, timeField);

    if (startTimeFieldError) runningBoolean = runningBoolean || true;
  }

  return runningBoolean;
};

const isValidNFD = async (state: any, setState: any): Promise<boolean> => {
  const defaultParameters = "view=tiny&poll=false&nocache=false";
  return new Promise(async (resolve, reject) => {
    try {
      // make request to NFD address endpoint to quickly validate the NFD
      const results = await fetch(
        `https://api.nf.domains/nfd/${state.fields.accountAddress}?${defaultParameters}`
      );
      const data = await results.json();
      // if it's a valid NFD add deposit address and turn the NFD flag on.
      setState({
        ...state,
        fields: {
          ...state.fields,
          isNFD: true,
          nfdAddress: data.depositAccount,
        },
      });
      if (results.ok) {
        resolve(true);
      } else {
        throw new Error("NFD is invalid");
      }
    } catch (e) {
      // This means the NFD was invalid, so we need to update state to reflec that
      reject(false);
    }
  });
};

// basically a function that controls the flow of error detection for the form fields
export const errorsDetected = async (
  state: any,
  setState: any,
  t: TFunction<"translation", undefined>
) => {
  const nfdRegex = new RegExp("^(.+.algo)$", "g");
  const nfdSoftCheck = nfdRegex.test(state.fields.accountAddress);

  let nfdError = false;
  let addressError = false;

  try {
    // First do a soft check on the nfd, if it passes make a request to the NFD endpoint to validate.
    nfdError = nfdSoftCheck && !(await isValidNFD(state, setState));

    // If it's not a properly formatted NFD do a regular account address check
    addressError = !nfdSoftCheck && checkAccountAddress(state, setState, t);

    // if no nfd or address errors clear errors
    if (!nfdError && !addressError) {
      setErrorState(state, setState, "accountAddress", {
        error: false,
        msg: "",
      });
    }
  } catch (e) {
    // this means the NFD endpoint returned an error and our NFD if formatted correctly, but is invalid
    nfdError = true;
    addressError = checkAccountAddress(state, setState, t);
  }

  const dateTimeError = checkDateTime(state, setState);
  return nfdError || addressError || dateTimeError;
};
