/* @refresh reload */
import "./index.css";
import { render } from "solid-js/web";

import App from "./App";
import { GlobalContextProvider } from "./context/store";
import { TransProvider } from "@mbarzda/solid-i18next";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
  );
}

render(
  () => (
    <TransProvider>
      <GlobalContextProvider>
        <App />
      </GlobalContextProvider>
    </TransProvider>
  ),
  root!
);
