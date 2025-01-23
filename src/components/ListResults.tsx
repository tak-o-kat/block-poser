import { For, Show } from "solid-js";
import { useGlobalContext } from "../context/store";
import { SkeletonListResult } from "./SkeletonLoaders";

const ListResults = () => {
  const store: any = useGlobalContext();
  const basisType = store.state.results.getRewards ? "4" : "3";
  const blockBasis = `basis-1/${basisType}`;
  const dateTimeBasis = `basis-2/${basisType}`;

  return (
    <section class="mx-auto w-full p-4 bg-gray-100 dark:bg-gray-800">
      <Show when={store.state.results.getList}>
        <div class="mx-auto sm:max-w-3xl block items-center justify-center h-full text-gray-600 dark:text-gray-400 p-3">
          <div class="flex flex-row justify-center w-full py-1.5 text-sm sm:text-lg">
            <div
              class={`${blockBasis} flex justify-center border-b border-r border-gray-300 dark:border-gray-600 font-semibold`}
            >
              Block
            </div>
            <Show when={store.state.results.getRewards}>
              <div class="basis-1/4 flex justify-center border-b border-r border-gray-300 dark:border-gray-600 font-semibold">
                Rewards
              </div>
            </Show>
            <div
              class={`${dateTimeBasis} flex justify-center border-b border-gray-300 dark:border-gray-600 font-semibold`}
            >
              DateTime
            </div>
          </div>
          <Show
            when={!store.state.results.isLoading}
            fallback={<SkeletonListResult />}
          >
            <For
              each={store.state.results.blockList}
              fallback={
                <div class="basis-2/3 flex py-2 justify-center">No Blocks</div>
              }
            >
              {(item) => (
                <div class="flex py-1 text-sm sm:text-lg">
                  <div class={`${blockBasis} flex justify-center`}>
                    <a
                      href={`https://allo.info/block/${item?.round}`}
                      target="_blank"
                      class="underline"
                    >
                      {item?.round}
                    </a>
                  </div>
                  <Show when={store.state.results.getRewards}>
                    <div class="basis-1/4 flex justify-center">
                      {((item?.header?.pp || 0) * 10e-7).toFixed(4)}
                    </div>
                  </Show>

                  <div class={`${dateTimeBasis} flex justify-center`}>
                    {item?.realtime}
                  </div>
                </div>
              )}
            </For>
          </Show>
        </div>
      </Show>
    </section>
  );
};

export default ListResults;
