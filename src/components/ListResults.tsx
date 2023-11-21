import { For, Show } from 'solid-js';
import { useGlobalContext } from '../context/store';

const ListResults = () => {
  const store: any = useGlobalContext();

  return (
    <section class="mx-auto w-full p-4 text-gray-600 dark:text-gray-100">
      <Show when={store.state.results.getList}>
        <div class="mx-auto sm:max-w-3xl block items-center justify-center h-full text-gray-600 dark:text-gray-400 p-3">
          <div class="flex flex-row justify-center w-full">
            <div class="basis-1/3 flex justify-center border-b border-r border-gray-300 dark:border-gray-600 font-semibold">Block</div>
            <div class="basis-2/3 flex justify-center border-b border-gray-300 dark:border-gray-600 font-semibold">DateTime</div>
          </div>
          <For each={store.state.results.blockList} fallback={<div>No Data</div>}>
            {(item, index) => (
              <div class="flex py-1">
                <div class="basis-1/3 flex justify-center">{item?.height}</div>
                <div class="basis-2/3 flex justify-center">{item?.timestamp?.time}</div>
              </div>
            )}
          </For>
        </div>
      </Show>
    </section>
  );
};

export default ListResults;