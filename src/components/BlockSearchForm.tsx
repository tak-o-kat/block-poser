import { Show, createSignal } from 'solid-js';
import { PickerValue, TimeValue } from '@rnwonder/solid-date-picker';

import SelectPreset from './SelectPreset';
import SolidDatePicker from './SolidDatePicker';
import SolidTimePicker from './SolidTimePicker';
import { useGlobalContext } from '../context/store';
import { graphqlClient } from '../utils/graphqlClient';
import { findBalance, getBlockCount } from '../utils/graphqlQueries';
import { errorsDetected } from '../utils/validation';
import { createStore } from 'solid-js/store';
import { convertTime12to24 } from '../utils/helperFunctions';
import NodeAddress from './NodeAddress';



const BlockSearchForm = () => {
  const store: any = useGlobalContext();
  const gmtDate = new Date().toISOString().slice(0, 10);
  const [year, month, day] = (gmtDate).split('-').map((n) => parseInt(n));
  const currentTimeText = "Current Time";
  const [searching, setSearching] = createSignal(false);
  const [startDate, setStartDate] = createSignal<PickerValue>({
    label: '',
    value: {},
  });
  const [startTime, setStartTime] = createSignal<TimeValue>({
    label: '',
    value: {}
  });
  const [endDate, setEndDate] = createSignal<PickerValue>({
    label: gmtDate,
    value: {
      selectedDateObject: { year: year, month: month - 1, day: day },
    },
  });
  const [endTime, setEndTime] = createSignal<TimeValue>({
    label: currentTimeText,
    value: { hour: 0, minute: 0, second: 0},
  });

  const [formState, setFormState] = createStore({
    fields: {
      accountAddress: '',
      preset: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
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
    setTimeout(function() {
      setFormState({
        ...formState,
        fields: {
          ...formState.fields,
          startDate: startDate().label,
          startTime: startTime().label,
          endDate: endDate().label,
          endTime: endTime().label === currentTimeText ? new Date().toISOString().slice(11,19) : endTime().label, // get GMT time if current time
        }
      });

      // Check if any field has errors
      if (!errorsDetected(formState, setFormState)) { //
        // Set the graphql variables
        const variables = {
          addy: formState.fields.accountAddress,
          start: `${formState.fields.startDate}T${convertTime12to24(formState.fields.startTime)}.000Z`, // 2023-10-01T00:00:00.000Z
          end: `${formState.fields.endDate}T${convertTime12to24(formState.fields.endTime)}.000Z`,
        }

        // Make graphql query request
        try {
          //const req = await graphqlClient.request(getBlockCount, variables);
          console.log(req);
        } catch (error) {
          console.log(error);
        }
      }
      setSearching(false);

    }, 1000);
      
  };

  return (
    <section class="mx-auto w-full px-4 py-4 sm:px-8 sm:py-10 text-gray-600 dark:text-gray-100">
      <div class="mx-auto sm:max-w-3xl pb-5 border-b border-gray-600">
        <form onSubmit={submit} class=""> 
          <fieldset disabled={searching()} class="sm:max-w-2xl mx-auto mb-0 mt-4 sm:mt-8 space-y-4">
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
            <div class="flex justify-center text-sm"><span class="font-semibold">Note</span>: All dates and times reflect GMT</div>
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
            <h4 class={`flex justify-center ${formState.errors.startDate.error || formState.errors.startTime.error ? 'pt-6 sm:pt-2' : ''}`}>End Date & Time</h4>
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
            <div class="flex items-center justify-between">
              <button
                type="submit"
                aria-busy={searching()}
                disabled={searching()}
                class={`${searching() ? 'cursor-not-allowed opacity-50' : ''} inline-block w-full rounded-lg !bg-blue-400 dark:!bg-blue-500 px-5 py-3 font-medium text-white sm:w-[12rem]`}
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