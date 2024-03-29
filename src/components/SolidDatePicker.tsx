import { Show, Accessor, Setter } from "solid-js";
import DatePicker, { PickerValue } from "@rnwonder/solid-date-picker";
import { useTransContext } from "@mbarzda/solid-i18next";

type DatePickerProps = {
  state: Accessor<PickerValue>;
  setState: Setter<PickerValue>;
  errors: {
    error: boolean;
    msg: string;
  };
};

const SolidDatePicker = (props: DatePickerProps) => {
  const minDate = { year: 2019, month: 5, day: 11 };
  const [year, month, day] = new Date()
    .toISOString()
    .slice(0, 10)
    .split("-")
    .map((n) => parseInt(n));
  const maxDate = { year: year, month: month - 1, day: day };
  const [t] = useTransContext();

  // tailwind CSS for datepicker
  const dateInputClasses =
    "bg-white dark:bg-gray-700 outline-none h-11 !pl-8 cursor-pointer";
  const wrapperClass = "bg-gray-200 dark:bg-gray-700";
  const btnClass =
    "text-gray-700 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600";

  return (
    <div class="flex flex-col w-full">
      <div
        class={`${
          props.errors.error ? "!border-red-500" : ""
        } relative w-full border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600`}
      >
        <div class="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none">
          <svg
            class="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
          </svg>
        </div>
        <div class="mx-1.5 text-gray-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white border-solid">
          <DatePicker
            placeholder={t("form_fields.placeholders.start_date")}
            value={props.state}
            setValue={props.setState}
            hideOutSideDays
            formatInputLabel="mm-dd-yyyy"
            minDate={minDate}
            maxDate={maxDate}
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
            currentDayBtnClass="!border-0"
          />
        </div>
      </div>
      <Show when={props.errors.error}>
        <span class="p-1 text-sm text-red-600">{props.errors.msg}</span>
      </Show>
    </div>
  );
};

export default SolidDatePicker;
