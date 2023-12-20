import { Show } from 'solid-js';
import { SetStoreFunction } from "solid-js/store";
import { FormState } from './BlockSearchForm';

type NodeAddressProps = {
  state: FormState;
  setState: SetStoreFunction<FormState>;
};

const NodeAddress = (props: NodeAddressProps) => {
  const updateState = (address: string) => {
    props.setState({ 
      fields: {
        ...props.state.fields,
        accountAddress: address,
      }
    });
  };
  
  return (
    <div class="">
      <label class="sr-only text-md">Node Address</label>
      <input
        value={props.state.fields.accountAddress}
        onChange={(e) => updateState(e.currentTarget.value)}
        type="text"
        name="AccountAddress"
        class={`${props.state.errors.accountAddress.error ? 'border-red-500 dark:border-red-500' : ''} h=[3rem] bg-white dark:bg-gray-700 disabled:opacity-100 border w-full rounded-lg p-3 pe-12 border-gray-300 dark:border-gray-600 outline-none`}
        placeholder="Node Address or NFD"
        maxlength={58}
      />
      <Show when={props.state.errors.accountAddress.error}>
        <span class="p-1 text-sm text-red-600">{props.state.errors.accountAddress.msg}</span>
      </Show>
    </div>
  );
};

export default NodeAddress;
