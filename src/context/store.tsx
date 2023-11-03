import { createStore } from "solid-js/store";
import { createContext, useContext } from 'solid-js';

const store = {
  searchResults: {
    account: null,
    accountBalance: 0,
    blocksProposed: 0,
  },
  theme: null,
}

const GlobalContext = createContext();

export function GlobalContextProvider(props: any) {
  const [state, setState] = createStore(store);

  return (
    <GlobalContext.Provider value={{state, setState}}>
      {props.children}
    </GlobalContext.Provider>
  )
}

export const useGlobalContext = () => useContext(GlobalContext)!;