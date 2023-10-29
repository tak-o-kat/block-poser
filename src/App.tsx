import type { Component } from 'solid-js';

import Header from './Components/Header';
import BlockSearchForm from './Components/BlockSearchForm';


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
