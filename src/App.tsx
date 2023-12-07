import { type Component } from 'solid-js';

import Header from './components/Header';
import Footer from './components/Footer';
import BlockSearchForm from './components/BlockSearchForm';
import BlockResults from './components/BlockResults';
import ListResults from './components/ListResults';

const App: Component = () => {
  return (
    <div class="flex flex-col h-screen bg-gray-100 dark:bg-gray-800">
      <div class="flex flex-col flex-1">
        <Header />
        <div class="flex flex-col">
          <BlockSearchForm />
          <BlockResults />
          <ListResults />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default App; 