import ThemeSwitcher from "./ThemeSwitcher";
import PoserIcon from "./PoserIcon";
import AlgorandLogo from "./AlgorandLogo";

const Header = () => {
  return (
    <header class="bg-gray-200 dark:bg-gray-900 px-4 py-5 text-gray-700 dark:text-gray-400">
      <div class="mx-auto max-w-screen-xl flex items-center justify-between">
        <div class="flex flex-grow flex-shrink justify-start ">
          <AlgorandLogo />
        </div>
        <div class="flex flex-grow flex-shrink justify-center px-2">
          <div class="flex items-center font-semibold text-3xl">
            <PoserIcon />
            <span class="">Blocki</span>
          </div>
        </div>
        <div class="flex flex-grow flex-shrink justify-end text-right">
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
};

export default Header;
