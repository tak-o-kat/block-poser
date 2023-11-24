import { createSignal } from 'solid-js';
import { PickerValue, TimeValue } from '@rnwonder/solid-date-picker';

import NodeAddress from './NodeAddress';
import SelectPreset from './SelectPreset';
import SolidDatePicker from './SolidDatePicker';
import SolidTimePicker from './SolidTimePicker';

import { useGlobalContext } from '../context/store';
import { graphqlClient } from '../utils/graphqlClient';
import { getBlockCount, getBlockList } from '../utils/graphqlQueries';
import { errorsDetected } from '../utils/validation';
import { createStore } from 'solid-js/store';
import { convertTime12to24, isoToDisplayDate, dateToIsoDate } from '../utils/helperFunctions';
import Toggle from './Toggle';



const BlockSearchForm = () => {
  const store: any = useGlobalContext();
  const currentTimeText = "Current Time";
  const gmtDate = new Date().toISOString().slice(0, 10);
  const [year, month, day] = (gmtDate).split('-').map((n) => parseInt(n));
  const [searching, setSearching] = createSignal(false);

  // Special signals required for solid date and time pickers
  const [startDate, setStartDate] = createSignal<PickerValue>({
    label: '',
    value: {},
  });
  const [startTime, setStartTime] = createSignal<TimeValue>({
    label: '',
    value: {}
  });
  const [endDate, setEndDate] = createSignal<PickerValue>({
    label: isoToDisplayDate(gmtDate),
    value: {
      selectedDateObject: { year: year, month: month - 1, day: day },
    },
  });
  const [endTime, setEndTime] = createSignal<TimeValue>({
    label: currentTimeText,
    value: { hour: 0, minute: 0, second: 0},
  });

  // Store for all fields and their errors
  const [formState, setFormState] = createStore({
    fields: {
      accountAddress: '',
      preset: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      getList: false,
    },
    errors: {
      accountAddress: {
        error: false,
        msg: '',
      },
      startDate: {
        error: false,
        msg: ''
      },
      startTime: {
        error: false,
        msg: ''
      },
      endDate: {
        error: false,
        msg: ''
      },
      endTime: {
        error: false,
        msg: ''
      }
    },
  });

  const submit = async (e: any) => {
    e.preventDefault();
    setSearching(true);
    // set date and time values into the form state
    setFormState({
      ...formState,
      fields: {
        ...formState.fields,
        startDate: dateToIsoDate(startDate().label),
        startTime: startTime().label,
        endDate: dateToIsoDate(endDate().label),
        endTime: endTime().label === currentTimeText ? new Date().toISOString().slice(11,19) : endTime().label, // get GMT time if current time
      }
    });

    // Check if any field has errors
    if (!errorsDetected(formState, setFormState)) { //
      // Set the graphql variables
      const vars = {
        addy: formState.fields.accountAddress,
        start: `${formState.fields.startDate}T${convertTime12to24(formState.fields.startTime)}.000Z`,
        end: `${formState.fields.endDate}T${convertTime12to24(formState.fields.endTime)}.000Z`,
      }

      // Make graphql query algonode requests
      try {
        const accountResp: any = await fetch(`https://mainnet-api.algonode.cloud/v2/accounts/${vars.addy}?format=json&exclude=all`);
        const accountInfo: any = await accountResp.json();
        const blockResp: any = await graphqlClient.request(getBlockCount, vars);
        const listResp: any = formState.fields.getList ? await graphqlClient.request(getBlockList, vars) : [];

        // set all the response data into the global context to display the results
        store.setState({
          results: {
            status: accountInfo.status,
            accountAddress: formState.fields.accountAddress,
            startDateTime: `${isoToDisplayDate(formState.fields.startDate)} ${convertTime12to24(formState.fields.startTime)} GMT`,
            endDateTime: `${isoToDisplayDate(formState.fields.endDate)} ${convertTime12to24(formState.fields.endTime)} GMT`,
            blocksProposed: `${blockResp.algorand.blocks[0].count}`,
            hasResults: true,
            getList: formState.fields.getList,
            blockList: listResp?.algorand?.blocks || [],
          }
        });
      } catch (error) {
        // Handle server error
        console.log(error);
      }
    }
    // Turn off searching flag
    setSearching(false);
  };

  return (
    <section class="mx-auto w-full p-4 text-gray-600 dark:text-gray-100">
      <div class="mx-auto sm:max-w-3xl pb-5 border-b border-gray-600">
        <form onSubmit={submit} class=""> 
          <fieldset disabled={searching()} class="mx-auto mb-0 mt-4 sm:mt-8 space-y-4">
            <NodeAddress 
              state={formState}
              setState={setFormState}
            />
            <SelectPreset
              setStartDate={setStartDate}
              setStartTime={setStartTime}
              setEndDate={setEndDate}
              setEndTime={setEndTime}
              state={formState}
              setState={setFormState}
            />
            <div class="flex justify-center text-sm">
              <span class="font-semibold">Note</span>: All dates and times reflect GMT
            </div>
            <h4 class="flex justify-center">Start Date & Time</h4>
            <div class='flex flex-row gap-4 h-[3rem]'>
              <SolidDatePicker 
                state={startDate}
                setState={setStartDate}
                errors={formState.errors.startDate}
              />
              <SolidTimePicker 
                state={startTime}
                setState={setStartTime}
                errors={formState.errors.startTime}
              />
            </div>
            <h4 class={`flex justify-center ${formState.errors.startDate.error || formState.errors.startTime.error ? 'pt-6 sm:pt-2' : ''}`}>
              End Date & Time
            </h4>
            <div class='flex flex-row gap-4 h-[3rem]'>
              <SolidDatePicker 
                state={endDate}
                setState={setEndDate}
                errors={formState.errors.endDate}
              />
              <SolidTimePicker 
                state={endTime}
                setState={setEndTime}
                errors={formState.errors.endTime}
              />
            </div>
            <div class="flex flex-row items-center">
              <Toggle 
                state={formState}
                setState={setFormState}
              />
              <span class="px-3">Get the last 10 blocks proposed!</span>
            </div>
            
            <div class="flex items-center justify-between">
              <button
                type="submit"
                aria-busy={searching()}
                disabled={searching()}
                class={`${searching() ? 'cursor-not-allowed opacity-50' : ''} inline-block w-full rounded-lg !bg-blue-400 dark:!bg-blue-500 
                px-5 py-3 font-medium text-white sm:w-[12rem]`}
              >
                {searching() ? 'Seaching...' : 'Search'}
              </button>
            </div>

          </fieldset>
        </form>
      </div>
    </section>
  )
};

export default BlockSearchForm;