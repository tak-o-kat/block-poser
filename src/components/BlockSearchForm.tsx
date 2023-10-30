import type { Component } from 'solid-js';

const BlockSearchForm: Component = () => {
  return (
    <div class="mx-auto w-full px-4 py-4 sm:px-8 sm:py-10">
      <div class="mx-auto sm:max-w-xl pb-5 border-b border-gray-600">
        <div class="text-center">
          <h1 class="text-xl font-bold sm:text-3xl text-gray-600 dark:text-gray-100">Get Blocks!</h1>
        </div>
        <form action="" class="w-full mx-auto mb-0 mt-4 sm:mt-8 space-y-4">
          <div>
            <label for="address" class="sr-only">Node Address</label>
            <div>
              <input
                type="text"
                class="w-full rounded-lg p-3 pe-12 text-sm text-gray-800 border-transparent outline-none"
                placeholder="Node Address"
              />
            </div>
          </div>

          <div>
            <select id="countries" class="bg-white text-gray-800 h-11 w-full rounded-lg border-r-8 border-transparent px-2 text-sm outline-0 outline-gray-100">
              <option selected>Select a Period</option>
              <option value="US">Gov - 9</option>
              <option value="CA">Gov - 8</option>
              <option value="FR">Gov - 7</option>
              <option value="DE">Gov - 6</option>
            </select>

          </div>

          <div class="flex items-center justify-between">
            <button
              type="submit"
              class="inline-block w-full rounded-lg bg-black px-5 py-3 font-medium text-white sm:w-[12rem]"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  )
};

export default BlockSearchForm;