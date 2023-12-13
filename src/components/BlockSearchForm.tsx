import { Show, createSignal, onMount } from 'solid-js';
import { PickerValue, TimeValue } from '@rnwonder/solid-date-picker';

import NodeAddress from './NodeAddress';
import SelectPreset from './SelectPreset';
import SolidDatePicker from './SolidDatePicker';
import SolidTimePicker from './SolidTimePicker';
import Toggle from './Toggle';

import { useGlobalContext } from '../context/store';
import { graphqlClient } from '../utils/graphqlClient';
import { getBlocksProposed, getBlocksList } from '../utils/graphqlQueries';
import { errorsDetected } from '../utils/validation';
import { createStore } from 'solid-js/store';
import { 
  convertTime12to24, 
  isoToDisplayDate, 
  dateToIsoDate, 
  saveLocalData, 
  restoreLocalData, 
  getSplitDates,
  getSplitTime,
  deleteLocalData
} from '../utils/helperFunctions';


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
      isNFD: false,
      nfdAddress: '',
      accountAddress: '',
      preset: false,
      presetType: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      getList: false,
      dump: false
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


  // submit a request for blocks and stuff
  const submit = async (e: any) => {
    e.preventDefault();
    setSearching(true);
    // if preset is selected recalculate the datetime fields
    if (formState.fields.preset) {
      const selectElement = document.getElementById("Select-Preset");
      selectElement.dispatchEvent(new Event("change"));
    }

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
    if (!(await errorsDetected(formState, setFormState))) { 
      // Save form state for the local to support Brave refreshing the page
      saveLocalData(formState.fields);

      // set global state to loading
      store.setState({
        results: {
          ...store.state.results,
          isLoading: true,
        }
      })

      // Set the graphql variables
      const vars = {
        addy: formState.fields.isNFD ? formState.fields.nfdAddress : formState.fields.accountAddress,
        start: `${formState.fields.startDate}T${convertTime12to24(formState.fields.startTime)}.000Z`,
        end: `${formState.fields.endDate}T${convertTime12to24(formState.fields.endTime)}.000Z`,
      }
      // Make graphql query algonode requests
      try {
        const accountResp: any = await fetch(`https://mainnet-api.algonode.cloud/v2/accounts/${vars.addy}?format=json&exclude=all`);
        const accountInfo: any = await accountResp.json();
        
        // if blocks proposed list is needed, we can make one call to the endpoint to get the block count and block list
        const blocksResp: any = await (formState.fields.getList ? graphqlClient.request(getBlocksList, vars) : graphqlClient.request(getBlocksProposed, vars));
        
        // set all the response data into the global context to display the results
        store.setState({
          results: {
            status: accountInfo.status,
            isNFD: formState.fields.isNFD,
            nfdAddress: formState.fields.isNFD ? formState.fields.nfdAddress : '',
            accountAddress: formState.fields.accountAddress,
            startDateTime: `${isoToDisplayDate(formState.fields.startDate)} ${convertTime12to24(formState.fields.startTime)} GMT`,
            endDateTime: `${isoToDisplayDate(formState.fields.endDate)} ${convertTime12to24(formState.fields.endTime)} GMT`,
            blocksProposed: `${blocksResp.blocks.totalCount}`,
            hasResults: true,
            getList: formState.fields.getList,
            blockList: blocksResp?.blocks?.nodes || [],
            isLoading: false,
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

  onMount(() => {
    // check to see if a navigation of type back_forward was triggered
    const entry = window.performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
    const type: string = entry.type;
    if (type === 'back_forward') {
      // a back_forward was triggered restore the form state from local storage
      const localForm = restoreLocalData();
      
      // custom form, restore all date/time fields
      setFormState({
        fields: localForm ? localForm : formState.fields
      });

      // Next we'll check if the restore type is preset or custom for date/time
      if (localForm.preset) {
        const selectElement = document.getElementById("Select-Preset") as HTMLSelectElement;
        selectElement.value = localForm.presetType;
        selectElement.dispatchEvent(new Event("change"));
      } else {
        // restore date/time state for start and end
        let [year, month, day] = getSplitDates(localForm.startDate);
        setStartDate({
          label: isoToDisplayDate(localForm.startDate),
          value: {
            selectedDateObject: { year: year, month: month - 1, day: day, }
          }
        });
        let [hour, minute, second] = getSplitTime(localForm.startTime);
        setStartTime({
          label: localForm.startTime,
          value: { hour: hour, minute: minute, second: second ? second : 0 }
        });
  
        [year, month, day] = getSplitDates(localForm.endDate);
        setEndDate({
          label: isoToDisplayDate(localForm.endDate),
          value: {
            selectedDateObject: { year: year, month: month - 1, day: day }
          }
        });

        [hour, minute, second] = getSplitTime(localForm.endTime);
        setEndTime({
          label: localForm.endTime,
          value: { hour: hour, minute: minute, second: second ? second : 0 }
        });
      };
    } else {
      // delete the local data
      deleteLocalData();
    }
  });

  return (
    <section class="mx-auto w-full p-4 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-100">
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
            <fieldset disabled={formState.fields.preset} class={`${formState.fields.preset && 'opacity-60'} mx-auto mb-0 mt-4 sm:mt-8 space-y-4`}>
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
            </fieldset>
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
            {/* <div class="flex items-center justify-between">
              <button
                type="button"
                class={`inline-block w-full rounded-lg !bg-blue-400 dark:!bg-blue-500 px-5 py-3 font-medium text-white sm:w-[12rem]`}
                onclick={() => {
                  setFormState({
                    ...formState,
                    fields: {
                      ...formState.fields,
                      dump: !formState.fields.dump
                    }
                  })
                }}
              >
                Dump
              </button>
            </div>
            <Show when={formState.fields.dump}>
              {`type: ${window.performance.getEntriesByType("navigation")[0]?.type}`}
              <pre>
                {`${JSON.stringify(restoreLocalData(), null, 2)}`}
              </pre>
            </Show> */}
          </fieldset>
        </form>
      </div>
    </section>
  )
};

export default BlockSearchForm;