import { createResource, type Component } from 'solid-js';
import { createClient } from '@urql/core';

import Header from './components/Header';
import BlockSearchForm from './components/BlockSearchForm';

const client = createClient({
  url: "https://graphql.bitquery.io",
  exchanges: []
});

const [count] = createResource(() => 
  client.query<any>(
    `query {
      algorand {
        blocks(options: {limit: 5, offset: 0}, date: {since: "2023-10-28", till: null}) {
          height
        }
      }
    }`
   ).toPromise()
    .then(({ data }) => console.log(data)));




const App: Component = () => {
  return (
    <>
      <Header />
      <div class="flex flex-row h-screen overflow-hidden bg-gray-100 dark:bg-gray-800">
          <BlockSearchForm />
      </div>
    </>
  );
};

export default App;