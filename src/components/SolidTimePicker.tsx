import { Component, createSignal } from 'solid-js';

import {
  TimeValue,
  TimePicker,
} from '@rnwonder/solid-date-picker';

const SolidTimePicker: Component = () => {
  const [time, setTime] = createSignal<TimeValue>({
    label: '',
    value: {},
  });

  const timeInputClasses = "bg-white dark:bg-gray-700 outline-none h-11 !pl-11 cursor-pointer";
  const wrapperClass = "bg-gray-200 dark:bg-gray-700"
  const btnClass = "text-gray-700 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600"

  return (
    <div class="relative w-full border-2 rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 bg">
      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clip-rule="evenodd" />
        </svg>
      </div>
      <div class="mx-1 text-gray-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white border-solid">
        <TimePicker
          placeholder="00:00 AM"
          value={time} 
          setValue={setTime}
          inputClass={timeInputClasses}
          timePickerWrapperClass={wrapperClass}
          prevNextTimeViewBtnClass={btnClass}
          timeAnalogWrapperClass={wrapperClass}
          timePickerMeridiemBtnClass={btnClass}
          timeAnalogNumberClass={btnClass}
          timePickerTopAreaClass={btnClass}
          timePickerBottomAreaClass={wrapperClass}
          timeAnalogClockHandClass={btnClass}
          inputWrapperClass={btnClass}
          nextTimeViewBtnClass={btnClass}
          prevTimeViewBtnClass={btnClass}
          timeAnalogClockCenterDotClass={btnClass}
        />
      </div>
    </div>
  );
};

export default SolidTimePicker;