import { useGlobalContext } from '../context/store';

const BlockResults = () => {
  const store: any = useGlobalContext();

  return (
    <section class="mx-auto w-full pb-3 px-4 first-letter:py-4 sm:px-8 sm:py-10 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-100">
      <div class="mx-auto sm:max-w-3xl ">
        <div class="overflow-scroll-y">
          <div class="flow-root">
            <dl class="-my-3 divide-y divide-gray-300 sm:text-base text-sm">
              <div class="grid grid-cols-1 gap-1 py-3 sm:grid-cols-4 sm:gap-2">
                <dt class="font-medium">Node Address:</dt>
                <dd 
                  class="sm:col-span-2 overflow-auto md:overflow-visible 
                    overflow-x-scroll px-2 md:w-[24rem]"
                >{store.state.results.accountAddress}</dd>
              </div>

              <div class="grid grid-cols-1 gap-1 py-3 sm:grid-cols-4 sm:gap-4">
                <dt class="font-medium">From:</dt>
                <dd class="sm:col-span-2 px-2">{store.state.results.startDateTime}</dd>
              </div>

              <div class="grid grid-cols-1 gap-1 py-3 sm:grid-cols-4 sm:gap-4">
                <dt class="font-medium">Until:</dt>
                <dd class="sm:col-span-2 px-2">{store.state.results.endDateTime}</dd>
              </div>

              <div class="grid grid-cols-1 gap-1 py-3 sm:grid-cols-4 sm:gap-4">
                <dt class="font-medium">Blocks Proposed:</dt>
                <dd class="sm:col-span-2 px-2">{store.state.results.blocksProposed}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlockResults;