import { type Component } from 'solid-js';

import Header from './components/Header';
import BlockSearchForm from './components/BlockSearchForm';
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