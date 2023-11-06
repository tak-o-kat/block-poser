import { createStore } from "solid-js/store";
import { createContext, useContext } from 'solid-js';

const store = {
  searchForm: {
    fields: {
      accountAddress: '',
      govPeriod: '',
    },
    errors: {
      accountAddress: {
        error: false,
        msg: '',
      },
      govPeriod: {
        error: false,
        msg: ''
      }
    },
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