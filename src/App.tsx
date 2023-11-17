import { type Component } from 'solid-js';
import { gql } from 'graphql-request'

import Header from './components/Header';
import BlockSearchForm from './components/BlockSearchForm';
import { graphqlClient } from './utils/graphqlClient';
import { findBalance } from './utils/graphqlQueries';
import BlockResults from './components/BlockResults';

const App: Component = () => {
  return (
    <div class="h-screen w-full bg-gray-100 dark:bg-gray-800">
      <Header />
      <div class="flex flex-col">
        <BlockSearchForm />
        <BlockResults />
      </div>
    </div>
  );
};

export default App;