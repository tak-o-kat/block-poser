import { type Component } from 'solid-js';
import { gql } from 'graphql-request'

import Header from './components/Header';
import BlockSearchForm from './components/BlockSearchForm';
import { graphqlClient } from './utils/graphqlClient';
import { findBalance } from './utils/graphqlQueries';


//const data = await graphqlClient.request(findBalance, variables)

const App: Component = () => {


  return (
    <div class="h-screen w-full bg-gray-100 dark:bg-gray-800">
      <Header />
      <div class="flex flex-col">
        <BlockSearchForm />

        <section class="mx-auto sm:max-w-3xl pb-5 flex justify-center bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-100">
          <div class="">
            <div class="overflow-scroll-y">
              <div class="flow-root">
                <dl class="-my-3 divide-y divide-gray-300 sm:text-base text-sm">
                  <div class="grid grid-cols-1 gap-1 py-3 sm:grid-cols-4 sm:gap-2">
                    <dt class="font-medium">Node Address:</dt>
                    <dd class="sm:col-span-2 md:overflow-visible overflow-x-scroll px-2 w-[24rem]">53R4HSFA24P6F7PO5LPIWH2J3UZDEYDX5O72JQPYFI2RT4VOAJRJUESSNM</dd>
                  </div>

                  <div class="grid grid-cols-1 gap-1 py-3 sm:grid-cols-4 sm:gap-4">
                    <dt class="font-medium">From:</dt>
                    <dd class="sm:col-span-2 px-2">10-01-2023 00:00:00</dd>
                  </div>

                  <div class="grid grid-cols-1 gap-1 py-3 sm:grid-cols-4 sm:gap-4">
                    <dt class="font-medium">Until:</dt>
                    <dd class="sm:col-span-2 px-2">10-30-2023 14:50:35</dd>
                  </div>

                  <div class="grid grid-cols-1 gap-1 py-3 sm:grid-cols-4 sm:gap-4">
                    <dt class="font-medium">Blocks Proposed:</dt>
                    <dd class="sm:col-span-2 px-2">24</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>
        
      </div>
    </div>
  );
};

export default App;