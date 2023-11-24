import { createStore } from "solid-js/store";
import { createContext, useContext } from 'solid-js';

const store = {
  results: {
    status: '',
    hasResults: false,
    accountAddress: '',
    startDateTime: '',
    endDateTime: '',
    blocksProposed: '',
    getList: false,
    blockList: [],
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