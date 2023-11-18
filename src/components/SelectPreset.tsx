import { Show, createSignal } from "solid-js";
import { DateMath } from "@rnwonder/solid-date-picker";
import { convertTime24to12 } from '../utils/helperFunctions';

const SelectPreset= (props: any) => {
  const [selection, setSelection] = createSignal('');
  // Function to convert preset into all four date and time entries
  const updateFields = (value: string) => {
    setSelection(value);
    const currentDate = new Date().toISOString().slice(0, 10);
    const [currentDateYear, currentDateMonth, currentDateDay] = currentDate.split('-').map(n => parseInt(n));
    const currentDateObj = { year: currentDateYear, month: currentDateMonth - 1, day: currentDateDay };
    const currentTime = convertTime24to12(new Date().toISOString().slice(11,19));
    let dateTimeValues: any = [];

    const substractDates = (numType: number, type: string) => {
      return Object.create({
        startTime: currentTime,
        endTime: currentTime,
        endDate: currentDate,
        startDate: DateMath.set(currentDateObj).minus({ [type]: numType }).toString({ format: "yyyy-mm-dd" })
      });
    };

    switch (value) {
      case 'last24hours':
        dateTimeValues = substractDates(1, 'day');
        break;
      case 'last7days':
        dateTimeValues = substractDates(7, 'day');
        break;
      case 'last30days':
        dateTimeValues = substractDates(30, 'day');
        break;
      case 'lastyear':
        dateTimeValues =  substractDates(1, 'year');
        break;
      default:
        dateTimeValues = Object.create({
          startTime: '',
          endTime: currentTime,
          endDate: currentDate,
          startDate: ''
        });
        break;
    }

    let [year, month, day] = dateTimeValues.startDate.split('-').map((n) => parseInt(n));
    props.setStartDate({
      label: dateTimeValues.startDate,
      value: {
        selectedDateObject: {year: year, month: month - 1 , day: day}
      }
    });

    let [hour, minute, second] = dateTimeValues.startTime.split(':').map((n) => parseInt(n));
    props.setStartTime({
      label: dateTimeValues.startTime,
      value: {hour: hour, minute: minute, second: second}
    });

    [year, month, day] = dateTimeValues.endDate.split('-').map((n) => parseInt(n));
    props.setEndDate({
      label: dateTimeValues.endDate,
      value: {
        selectedDateObject: {year: year, month: month - 1 , day: day}
      }
    });

    [hour, minute, second] = dateTimeValues.endTime.split(':').map((n: string) => parseInt(n));
    props.setEndTime({
      label: dateTimeValues.endTime,
      value: {hour: hour, minute: minute, second: second}
    });
  };
  
  return (
    <div class="h-[3rem] border border-gray-300 dark:border-gray-600 rounded-lg">
      <select
        value={selection()}
        onChange={(e) => updateFields(e.currentTarget.value)}
        aria-placeholder="Select preset"
        class={`rounded-lg bg-white dark:bg-gray-700 disabled:bg-white disabled:opacity-100 h-full w-full border-1 pl-2 outline-0 border-r-8 border-r-white dark:border-r-gray-700`}>
        <option value=''>Default values (Presets)</option>
        <option value="last24hours">Last 24 hours</option>
        <option value="last7days">Last 7 days</option>
        <option value="last30days">Last 30 days</option>
        <option value="lastyear">Last year</option>
      </select>
    </div>
  );
};

export default SelectPreset;
