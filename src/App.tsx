import {
  createSignal,
  createEffect,
  Show,
  type Component,
  onMount,
} from "solid-js";
import i18next from "i18next";
import HttpBackend from "i18next-http-backend";
import { getI18NextConfig } from "./utils/helperFunctions";

import Header from "./components/Header";
import Footer from "./components/Footer";
import BlockSearchForm from "./components/BlockSearchForm";
import BlockResults from "./components/BlockResults";
import ListResults from "./components/ListResults";

const App: Component = () => {
  const [isReady, setIsReady] = createSignal(false);

  createEffect(() => {
    i18next
      .use(HttpBackend)
      .init(getI18NextConfig())
      .then(() => setIsReady(true))
      .catch((err) => console.error(err));
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
