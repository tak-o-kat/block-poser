import { SetStoreFunction } from "solid-js/store";
import { FormState } from "./BlockSearchForm";

type ToggleProps = {
  state: FormState;
  setState: SetStoreFunction<FormState>;
};

export const ListToggle = (props: ToggleProps) => {
  return (
    <label
      for="GetList"
      class="relative flex h-8 w-12 cursor-pointer [-webkit-tap-highlight-color:_transparent]"
    >
      <input
        type="checkbox"
        checked={props.state.fields.getList}
        id="GetList"
        class="peer sr-only"
        onChange={() =>
          props.setState({
            ...props.state,
            fields: {
              ...props.state.fields,
              getList: !props.state.fields.getList,
            },
          })
        }
      />
      <span class="absolute inset-0 m-auto h-2 rounded-full bg-gray-300 dark:bg-gray-700"></span>
      <span class="absolute inset-y-0 start-0 m-auto h-6 w-6 rounded-full bg-gray-600 transition-all peer-checked:start-6 peer-checked:[&_>_*]:scale-0">
        <span class="absolute inset-0 m-auto h-4 w-4 rounded-full bg-gray-200 dark:bg-gray-800 transition"></span>
      </span>
    </label>
  );
};

export const RewardsToggle = (props: ToggleProps) => {
  return (
    <label
      for="GetRewards"
      class="relative flex h-8 w-12 cursor-pointer [-webkit-tap-highlight-color:_transparent]"
    >
      <input
        type="checkbox"
        checked={props.state.fields.getRewards}
        id="GetRewards"
        class="peer sr-only"
        onChange={() =>
          props.setState({
            ...props.state,
            fields: {
              ...props.state.fields,
              getRewards: !props.state.fields.getRewards,
            },
          })
        }
      />
      <span class="absolute inset-0 m-auto h-2 rounded-full bg-gray-300 dark:bg-gray-700"></span>
      <span class="absolute inset-y-0 start-0 m-auto h-6 w-6 rounded-full bg-gray-600 transition-all peer-checked:start-6 peer-checked:[&_>_*]:scale-0">
        <span class="absolute inset-0 m-auto h-4 w-4 rounded-full bg-gray-200 dark:bg-gray-800 transition"></span>
      </span>
    </label>
  );
};
