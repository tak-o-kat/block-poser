import { createSignal, createEffect, Show, type Component } from "solid-js";
import i18next from "i18next";
import Backend from "i18next-http-backend";

import Header from "./components/Header";
import Footer from "./components/Footer";
import BlockSearchForm from "./components/BlockSearchForm";
import BlockResults from "./components/BlockResults";
import ListResults from "./components/ListResults";

const App: Component = () => {
  const [isReady, setIsReady] = createSignal(false);

  createEffect(() => {
    createEffect(() => {
      i18next
        .use(Backend)
        .init({
          lng: `en-US`,
          debug: true,
          interpolation: {
            escapeValue: true,
          },
          fallbackLng: "en-US",
          // The default namespace to load when none
          // are specified explicitly.
          // "translation" is the default value here,
          // so we can can remove the `ns` option here
          // entirely if we wanted.
          ns: "translation",
          backend: {
            loadPath: "/locales/{{lng}}/{{ns}}.json",
          },
        })
        .then(() => setIsReady(true))
        .catch((err) => console.error(err));
    });
  });

  return (
    <div class="flex flex-col h-screen bg-gray-100 dark:bg-gray-800">
      <Show when={isReady()}>
        <div class="flex flex-col flex-1">
          <Header />
          <div class="flex flex-col">
            <BlockSearchForm />
            <BlockResults />
            <ListResults />
          </div>
        </div>
        <Footer />
      </Show>
    </div>
  );
};

export default App;
