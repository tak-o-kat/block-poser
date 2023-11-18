import type { Component } from 'solid-js';
import ThemeSwitcher from './ThemeSwitcher';
import PoserIcon from './PoserIcon';
import AlgorandLogo from './AlgorandLogo';

const Header: Component = () => {
  return (
    <header class="bg-gray-200 dark:bg-gray-900 mx-auto max-w-screen-xl px-4 py-2 flex items-center justify-between text-gray-900 dark:text-gray-100">
      <div class="flex flex-grow flex-shrinkjustify-start px-2">
        <AlgorandLogo />
      </div>
      <div class="flex flex-grow flex-shrink justify-center px-2">
        <h2 class="flex items-center font-semibold text-2xl">
          <PoserIcon />
          <span>Posr</span>
        </h2>
      </div>
      <div class="flex flex-grow flex-shrink justify-end text-right">
        <ThemeSwitcher />
      </div>
  </header>
  );
};

export default Header;