import { Show, Accessor, Setter } from "solid-js";
import { TimePicker, TimeValue } from "@rnwonder/solid-date-picker";
import { useTransContext } from "@mbarzda/solid-i18next";

type TimePickerProps = {
  state: Accessor<TimeValue>;
  setState: Setter<TimeValue>;
  errors: {
    error: boolean;
    msg: string;
  };
};

const SolidTimePicker = (props: TimePickerProps) => {
  const [t] = useTransContext();
  const timeInputClasses =
    "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-100 outline-none h-11 !pl-8 cursor-pointer";
  const wrapperClass =
    "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-100 font-bold";
  const btnClass = "text-gray-700 dark:text-gray-100 font-bold";

  return (
    <div class="flex flex-col w-full">
      <div
        class={`${
          props.errors.error ? "!border-red-500" : ""
        } flex bg-white relative w-full border rounded-lg dark:bg-gray-700 border-gray-300 dark:border-gray-600 bg`}
      >
        <div class="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
          <svg
            class="w-5 h-5 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="ml-1.5 w-full text-gray-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white border-solid">
          <TimePicker
            placeholder={t("form_fields.placeholders.start_time")}
            value={props.state}
            setValue={props.setState}
            inputClass={timeInputClasses}
            timePickerWrapperClass={wrapperClass}
            prevNextTimeViewBtnClass={btnClass}
            timeAnalogWrapperClass="bg-gray-100 dark:bg-gray-800"
            timePickerMeridiemBtnClass={btnClass}
            timeAnalogNumberClass={btnClass}
          />
        </div>
        <div class="flex items-center bg-white dark:bg-gray-700 border-l dark:border-gray-600 pl-1.5 pr-0.5 sm:pl-3 sm:pr-1.5 mr-1.5">
          GMT
        </div>
      </div>
      <Show when={props.errors.error}>
        <span class="p-1 text-sm text-red-600">{props.errors.msg}</span>
      </Show>
    </div>
  );
};

export default SolidTimePicker;
