import { createEffect, createSignal } from 'solid-js';

import DatePicker, {
  PickerValue,
} from '@rnwonder/solid-date-picker';

const SolidDatePicker = (props: any) => {
  const [date, setDate] = createSignal<PickerValue>({
    label: '',
    value: {},
  });

  // tailwind CSS for datepicker 
  const dateInputClasses = "bg-white dark:bg-gray-700 outline-none h-11 !pl-11 cursor-pointer";
  const wrapperClass = "bg-gray-200 dark:bg-gray-700"
  const btnClass = "text-gray-700 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600"

  const updateDate = () => {
    debugger;
    props.setState({
      searchForm: {
        fields: {
          [props.fieldName]: date()
        }
      }
    });
  };


  return (
    <div class="relative w-full border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600">
      <div class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
        </svg>
      </div>
      <div class="mx-1 text-gray-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white border-solid">
        <DatePicker
          placeholder='Select Date'
          value={date} 
          setValue={setDate}
          onChange={updateDate}
          hideOutSideDays
          formatInputLabel="yyyy-mm-dd"
          shouldCloseOnSelect={true}
          weekDaysType={"single"}
          inputClass={dateInputClasses}
          datePickerWrapperClass={wrapperClass}
          prevNextMonthBtnClass={btnClass}
          monthYearTriggerBtnClass={btnClass}
          monthYearSelectorWrapperClass={wrapperClass}
          monthYearOptionBtnClass={btnClass}
          weekNamesClass="text-gray-50 dark:text-gray-400"
          daysBtnClass={btnClass}
          currentDayBtnClass="!border-solid !border-gray-400 !dark:border-gray-600"
        />
      </div>
    </div>
  )
};

export default SolidDatePicker;



