import { createSignal } from "solid-js";
import { DateMath } from "@rnwonder/solid-date-picker";
import { convertTime24to12, isoToDisplayDate } from '../utils/helperFunctions';

type SelectProps = {
  setStartDate: any,
  setStartTime: any,
  setEndDate: any,
  setEndTime: any,
  state: any,
  setState: any
}

const SelectPreset= (props: SelectProps) => {
  const [selection, setSelection] = createSignal('');

  // Function to convert preset into all four date and time entries
  const updateFields = (value: string) => {
    setSelection(value);
    const currentDate = new Date().toISOString().slice(0, 10);
    const [currentDateYear, currentDateMonth, currentDateDay] = currentDate.split('-').map(n => parseInt(n));
    const currentDateObj = { year: currentDateYear, month: currentDateMonth - 1, day: currentDateDay };
    const currentTime = convertTime24to12(new Date().toISOString().slice(11,19));
    const gmt8plus = '16:00:00';
    let dateTimeValues: any = [];

    const dateSubtraction = (numType: number, type: string) => {
      return Object.create({
        startTime: currentTime,
        endTime: currentTime,
        endDate: currentDate,
        startDate: DateMath.set(currentDateObj).minus({ [type]: numType }).toString({ format: "yyyy-mm-dd" })
      });
    };

    const dateSet = (startDate: string, startTime: string, endDate: string, endTime: string) => {
      return Object.create({
        startDate: startDate,
        startTime: startTime,
        endDate: endDate,
        endTime: endTime,
      });
    }

    // Generate all four datetime fields depeneding on the preset selected
    switch (selection()) {
      case 'last24hours':
        dateTimeValues = dateSubtraction(1, 'day');
        break;
      case 'last7days':
        dateTimeValues = dateSubtraction(7, 'day');
        break;
      case 'last30days':
        dateTimeValues = dateSubtraction(30, 'day');
        break;
      case 'lastyear':
        dateTimeValues =  dateSubtraction(1, 'year');
        break;
      case 'genesis':
        const genesisDate = "2019-06-11";
        const genesisTime = "00:00:00";
        dateTimeValues =  dateSet(genesisDate, genesisTime, currentDate, currentTime);
        break;
      case 'gov9':
        dateTimeValues =  dateSet('2023-09-30', gmt8plus, currentDate, currentTime);
        break;
      case 'gov8':
        dateTimeValues =  dateSet('2023-06-30', gmt8plus, '2023-09-30', gmt8plus); 
        break;
      case 'gov7':
        dateTimeValues =  dateSet('2023-03-31', gmt8plus, '2023-06-30', gmt8plus); 
        break;
      default:
        dateTimeValues = Object.create({
          startTime: '',
          endTime: currentTime,
          endDate: currentDate,
          startDate: ''
        });
    };

    // Block access to the datetime fields unless user selects custom
    props.setState({
      ...props.state,
      fields: {
        ...props.state.fields,
        preset: selection() === '' ? false : true
      }
    });

    // Set the start date
    let [year, month, day] = dateTimeValues.startDate.split('-').map((n: string) => parseInt(n));
    props.setStartDate({
      label: dateTimeValues.startDate ? isoToDisplayDate(dateTimeValues.startDate) : '',
      value: !year ? '' : {
        selectedDateObject: {
          year: year ? year : 0, 
          month: month ? month - 1 : 0 , 
          day: day ? day : 0
        }
      }
    });
    
    let [hour, minute, second] = dateTimeValues.startTime.split(':').map((n: string) => parseInt(n));
    props.setStartTime({
      label: dateTimeValues.startTime,
      value: {
        hour: hour ? hour : 0, 
        minute: minute ? minute : 0, 
        second: second ? second : 0,
      }
    });

    [year, month, day] = dateTimeValues.endDate.split('-').map((n: string) => parseInt(n));
    props.setEndDate({
      label: isoToDisplayDate(dateTimeValues.endDate),
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
        id="Select-Preset"
        value={selection()}
        onChange={(e) => updateFields(e.currentTarget.value)}
        aria-placeholder="Select Preset"
        class={`rounded-lg bg-white dark:bg-gray-700 disabled:bg-white disabled:opacity-100 h-full w-full border-1 pl-2 outline-0 border-r-8 border-r-white dark:border-r-gray-700`}>
        <option selected value=''>Custom (Presets)</option>
        <option value="last24hours">Last 24 hours</option>
        <option value="last7days">Last 7 days</option>
        <option value="last30days">Last 30 days</option>
        <option value="lastyear">Last year</option>
        <option value="genesis">Genesis</option>
        <option value="gov9">Governance 9</option>
        <option value="gov8">Governance 8</option>
        <option value="gov7">Governance 7</option>
      </select>
    </div>
  );
};

export default SelectPreset;
