import { createStore } from "solid-js/store";
import { createContext, useContext } from 'solid-js';

export type GlobalStore = {
  results: {
    status: string;
    isLoading: boolean;
    hasResults: boolean;
    accountAddress: string;
    isNFD: boolean;
    nfdAddress: string;
    startDateTime: string;
    endDateTime: string;
    blocksProposed: string;
    getList: boolean;
    blockList: [];
  };
};

const store: GlobalStore = {
  results: {
    status: '',
    isLoading: false,
    hasResults: false,
    accountAddress: '',
    isNFD: false,
    nfdAddress: '',
    startDateTime: '',
    endDateTime: '',
    blocksProposed: '',
    getList: false,
    blockList: [],
  },
}

const GlobalContext = createContext();

export function GlobalContextProvider(props) {
  const [state, setState] = createStore(store);

  return (
    <GlobalContext.Provider value={{state, setState}}>
      {props.children}
    </GlobalContext.Provider>
  )
}

export const useGlobalContext = () => useContext(GlobalContext)!;