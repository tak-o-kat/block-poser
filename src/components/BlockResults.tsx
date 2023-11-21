import { Show } from 'solid-js';
import { useGlobalContext } from '../context/store';

const BlockResults = () => {
  const store: any = useGlobalContext();

  return (
    <section class="mx-auto w-full p-4 text-gray-600 dark:text-gray-100">
      <Show when={store.state.results.hasResults}>
        <div class="mx-auto sm:max-w-3xl flex items-center justify-center h-full rounded-lg text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 p-3">
          <div class="basis-1/4 p-2 h-full w-full flex flex-col items-center md:justify-center"> 
            <div class="text-4xl md:text-5xl font-extrabold text-blue-600 ">
              {store.state.results.blocksProposed}
            </div>
            <div class="text-lg">
              blocks
            </div>
          </div>
          <div class="basis-3/4 px-2 h-full flex md:justify-center overflow-auto">
            <div class="flex flex-col text-xs">
              <div class="  overflow-auto">
                {store.state.results.accountAddress}
              </div>
              <div class="">
                {`From: ${store.state.results.startDateTime}`}
              </div>
              <div class="">
              {`To: ${store.state.results.endDateTime}`}
              </div>
            </div>
          </div>
        </div>
      </Show>
    </section>
  );
};

export default BlockResults;