import type { Component } from 'solid-js';

import Header from './Components/Header';


const App: Component = () => {
  return (
    <>
      <Header />
      <p class="bg-white dark:bg-gray-800 text-content text-4xl text-center py-20">Hello tailwind!</p>
    </>
  );
};

export default App;
