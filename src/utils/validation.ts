import { isValidAddress } from "algosdk"

const setErrorState = (store: any, name: string, obj: any) => {
  store.setState({...store.state, 
    searchForm: {
      ...store.state.searchForm,
      errors: {
        ...store.state.searchForm.errors,
        [name]: obj
      }
    }
  });
}

const checkAccountAddress = (store: any): boolean => {
  let emptyFieldError = false;
  let invalidAddressError = false;
  const emptyFieldMsg = "Node address required!";
  const invalidAddressMsg = "Not a valid account address!";
  const attributeName = "accountAddress";

  // check if the field is empty
  emptyFieldError = store.state.searchForm.fields.accountAddress === '';
  
  // check if the field has a valid address, check if empty field error is fasle
  invalidAddressError = !emptyFieldError && !isValidAddress(store.state.searchForm.fields.accountAddress);

  // create the error fields that will be stored in global state
  const fields = {
    error: emptyFieldError || invalidAddressError,
    msg: emptyFieldError ? emptyFieldMsg : (invalidAddressError ? invalidAddressMsg: ''),
  }

  setErrorState(store, attributeName, fields);

  return emptyFieldError || invalidAddressError;
}

const checkGovPeriod = (store: any): boolean => {
  let govPeriodError = false;
  const noSelectErrorMsg = "Goverance period required!";
  const attributeName = "govPeriod";

  // Check if the select value is empty
  govPeriodError = store.state.searchForm.fields.govPeriod === '';

  const fields = {
    error: govPeriodError,
    msg: govPeriodError ? noSelectErrorMsg : '',
  }
  
  setErrorState(store, attributeName, fields);

  return govPeriodError;
}

export const errorsDetected = (store: any): boolean => {
  // run each check
  debugger;
  const addressCheck = checkAccountAddress(store);
  const govPeriodCheck = checkGovPeriod(store);

  return addressCheck || govPeriodCheck
}