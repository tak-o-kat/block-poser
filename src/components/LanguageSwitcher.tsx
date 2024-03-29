import { useTransContext } from "@mbarzda/solid-i18next";
import i18next from "i18next";
import { saveLanguage } from "../utils/helperFunctions";

import { createSignal, Show, onMount } from "solid-js";

const initializeLanguage = () => {
  let lang: string;
  if (typeof localStorage !== "undefined" && localStorage.getItem("lang")) {
    lang = localStorage.getItem("lang");
  } else if (localStorage.getItem("theme") === null) {
    lang = "en-US";
  } else {
    lang = "en-US";
  }
  return lang;
};

const LanguageSwitcher = () => {
  const [t, { changeLanguage }] = useTransContext();
  const [lang, setLang] = createSignal(initializeLanguage());

  const updateLang = (value: string) => {
    changeLanguage(value);
    saveLanguage(value);
  };

  // Check local storage for saved language settings
  onMount(() => {
    updateLang(lang());
  });

  return (
    <div class="">
      <select
        value={i18next.language}
        onChange={(e) => updateLang(e.target.value)}
        class="flex text-center items-center p-1 ps-1 w-[5rem] rounded-lg bg-white dark:bg-gray-700 disabled:bg-white disabled:opacity-100 outline-none border-1 appearance-none border-r-white dark:border-r-gray-700"
      >
        <option selected value="en-US">
          {t("english_label")}
        </option>
        <option value="es-ES">{t("spanish_label")}</option>
        <option value="ja-JP">{t("japanese_label")}</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
