import type { Component } from 'solid-js';
import ThemeSwitcher from './ThemeSwitcher';

const Header: Component = () => {
  return (
    <header class="bg-gray-100 dark:bg-gray-800">
      <div class="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div class="sm:flex sm:items-center sm:justify-between">
          <div class="text-center sm:text-left">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
              Welcome Back, Barry!
            </h1>

            <p class="mt-1.5 text-sm text-gray-500">
              Let's write a new blog post! 🎉
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