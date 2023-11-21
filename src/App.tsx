import { type Component } from 'solid-js';

import Header from './components/Header';
import BlockSearchForm from './components/BlockSearchForm';
import BlockResults from './components/BlockResults';
import ListResults from './components/ListResults';

const App: Component = () => {
  return (
    <div class="h-screen w-full bg-gray-100 dark:bg-gray-800">
      <Header />
      <div class="flex flex-col bg-gray-100 dark:bg-gray-800">
        <BlockSearchForm />
        <BlockResults />
        <ListResults />
      </div>
    </div>
  );
};

export default App; 