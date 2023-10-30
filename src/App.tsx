import type { Component } from 'solid-js';

import Header from './components/Header';
import BlockSearchForm from './components/BlockSearchForm';


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