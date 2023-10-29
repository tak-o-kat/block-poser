import type { Component } from 'solid-js';
import ThemeSwitcher from './ThemeSwitcher';

const Header: Component = () => {
  return (
    <header class="bg-gray-200 dark:bg-gray-900">
      <div class="mx-auto max-w-screen-xl px-4 py-4 sm:px-4 sm:py-4 lg:px-4">
        <div class="sm:flex sm:items-center sm:justify-between">
          <div class="text-center sm:text-left">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
              Block Ⱥ-Poser!  
            </h1>
            <p class="mt-1.5 text-sm text-gray-500">
              Lets find your Algorand blocks! 🎉
            </p>
          </div>
          <div class="mt-4 flex justify-center sm:mt-0 sm:text-center">
            <ThemeSwitcher />
          </div>
        </div>
      </div>
  </header>
  );
};

export default Header;