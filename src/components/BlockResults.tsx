import { Show } from "solid-js";
import { useGlobalContext } from "../context/store";
import { SkeletonBlockResult } from "./SkeletonLoaders";
import { useTransContext } from "@mbarzda/solid-i18next";
import AlgorandLogo from "./AlgorandLogo";

const BlockResults = () => {
  const store: any = useGlobalContext();
  const [t] = useTransContext();

  return (
    <section class="mx-auto w-full p-4 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-100">
      <Show when={store.state.results.isLoading}>
        <SkeletonBlockResult />
      </Show>
      <Show
        when={store.state.results.hasResults && !store.state.results.isLoading}
      >
        <div class="mx-auto sm:max-w-3xl flex items-center justify-center h-full rounded-lg text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 p-3">
          <div class="basis-1/4 p-2 h-[6rem] w-full flex flex-col items-center justify-center">
            <div class="text-4xl md:text-5xl font-extrabold text-blue-600">
              {store.state.results.blocksProposed}
            </div>
            <div class="text-lg">{`block${
              store.state.results.blocksProposed != 1 ? "s" : ""
            }`}</div>
          </div>
          <div class="basis-3/4 px-2 h-full flex items-center md:justify-center overflow-auto">
            <div class="flex flex-col text-xs">
              <div class="  overflow-auto">
                {store.state.results.accountAddress}
              </div>
              <Show when={store.state.results.isNFD}>
                <div class="  overflow-auto">
                  {store.state.results.nfdAddress}
                </div>
              </Show>
              <div class="  overflow-auto">
                {`${t("results.status")}: ${store.state.results.status}`}
              </div>
              <div class="">{`${t("results.from")}: ${
                store.state.results.startDateTime
              }`}</div>
              <div class="">{`${t("results.to")}: ${
                store.state.results.endDateTime
              }`}</div>
              <Show when={store.state.results.getRewards}>
                <div class="flex flex-row items-center gap-0">
                  {`${t("results.rewards")}: ${(
                    Number(store.state.results.rewards) * 10e-7
                  ).toFixed(4)} `}
                  <AlgorandLogo size={11} />
                </div>
              </Show>
            </div>
          </div>
        </div>
      </Show>
    </section>
  );
};

export default BlockResults;
