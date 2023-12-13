import { Component } from "solid-js"


export const SkeletonBlockResult: Component = () => {
  return (
    <div
      role="status"
      class="animate-pulse mx-auto sm:max-w-3xl flex flex-row items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 p-3"
    >
      <div class="basis-1/4 px-2 h-[6rem] w-full flex items-center justify-center">
        <div class="flex flex-col items-center justify-center h-full w-full overflow-hidden">
          <div class="h-[2.5rem] bg-gray-200 rounded-full dark:bg-gray-600 w-[75px] mb-2.5"></div>
          <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-600 w-[75px] mb-2.5"></div>
        </div>
      </div>
      <div class="basis-3/4 px-2 flex items-center justify-center h-full w-full overflow-hidden">
        <div class="flex flex-col justify-center overflow-hidden">
          <div class="h-3 bg-gray-200 rounded-full dark:bg-gray-600 w-[400px] mb-1.5"></div>
          <div class="h-3 bg-gray-200 rounded-full dark:bg-gray-600 w-[100px] mb-1.5"></div>
          <div class="h-3 bg-gray-200 rounded-full dark:bg-gray-600 w-[200px] mb-1.5"></div>
          <div class="h-3 bg-gray-200 rounded-full dark:bg-gray-600 w-[200px] mb-1.5"></div>
        </div>
      </div>
    </div>
  );
}