import { Component, Show, onMount } from 'solid-js';


import { useGlobalContext } from '../context/store';
import { graphqlClient } from '../utils/graphqlClient';
import { findBalance } from '../utils/graphqlQueries';
import { errorsDetected } from '../utils/validation';
import SolidDatePicker from './DatePicker';


const BlockSearchForm: Component = () => {
  const store: any = useGlobalContext();

  const submit = async (e: any) => {
    e.preventDefault();

    // Check if any field has errors
    if (!errorsDetected(store)) {
      // Set the graphql variables
      const variables = {
        //addy: field.address,
      }

       // Make graphql query request
      try {
        //const req = await graphqlClient.request(findBalance, variables);
        console.log();
      } catch (error) {
        console.log(error);
      }
    }
  };

  onMount(() => {

  });

  return (
    <section class="mx-auto w-full px-4 py-4 sm:px-8 sm:py-10">
      <div class="mx-auto sm:max-w-2xl pb-5 border-b border-gray-600">
        <div class="text-center">
          <h1 class="text-xl font-bold sm:text-3xl text-gray-600 dark:text-gray-100">Get Blocks!</h1>
        </div>
        <form onSubmit={submit} class="sm:w-[36rem] mx-auto mb-0 mt-4 sm:mt-8 space-y-4">
          <div>
            <label class="sr-only">Node Address</label>
            <div>
              <input
                value={store.state.searchForm.fields.accountAddress}
                onChange={(e) => store.setState(
                  { 
                    searchForm: {
                      ...store.state.searchForm,
                      fields: {
                        ...store.state.searchForm.fields,
                        accountAddress: e.currentTarget.value,
                      }
                    }
                  }
                )}
                type="text"
                class={`${store.state.searchForm.errors.accountAddress.error && 'border-red-500 outline'} w-full border-2 rounded-lg p-3 pe-12 text-sm text-gray-800 outline-none`}
                placeholder="Node Address"
                maxlength={58}
              />
              <Show when={store.state.searchForm.errors.accountAddress.error}>
                <span class="p-1 text-sm text-red-600">{store.state.searchForm.errors.accountAddress.msg}</span>
              </Show>
            </div>
          </div>


          <div>
            <select
              value={store.state.searchForm.fields.govPeriod}
              onChange={(e) => store.setState(
                { 
                  searchForm: {
                    ...store.state.searchForm,
                    fields: {
                      ...store.state.searchForm.fields,
                      govPeriod: e.currentTarget.value,
                    }
                  }
                }
              )}
              id="period" 
              class={`${store.state.searchForm.errors.govPeriod.error && 'border-red-500'} bg-white text-gray-800 h-12 w-full border-2 rounded-lg px-2 text-sm outline-0 outline-gray-100`}>
              <option selected value=''>Select a Period</option>
              <option value="g9">Gov - 9</option>
              <option value="g8">Gov - 8</option>
              <option value="g7">Gov - 7</option>
              <option value="g6">Gov - 6</option>
            </select>
            <Show when={store.state.searchForm.errors.govPeriod.error}>
              <span class="p-1 text-sm text-red-600">{store.state.searchForm.errors.govPeriod.msg}</span>
            </Show>
          </div>

          <SolidDatePicker />

          <div class="flex items-center justify-between">
            <button
              type="submit"
              class="inline-block w-full rounded-lg !bg-blue-400 dark:!bg-blue-500 px-5 py-3 font-medium text-white sm:w-[12rem]"
            >
              Search
            </button>
          </div>

        </form>
      </div>
    </section>
  )
};

export default BlockSearchForm;