import algonode from "../assets/algo_node.png";

const Footer = () => {

  return (
    <footer class="static bottom-0 flex px-4 py-5 bg-gray-100 dark:bg-gray-800">
      <div class="mx-auto max-w-screen-md flex flex-1 items-center justify-center">
        <div class="flex justify-between">
          <div class="flex justify-end text-teal-600 text-xs">
            <a href="https://algonode.io" aria-label="Algonode" class="flex flex-row items-center">
              <img class="h-[1.5rem]" src={algonode} alt="algo_node"></img>
              <span>powered by Algonode</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;