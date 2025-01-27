import { createEffect, createSignal, onMount } from "solid-js";
import { PickerValue, TimeValue } from "@rnwonder/solid-date-picker";
import { useTransContext } from "@mbarzda/solid-i18next";

import NodeAddress from "./NodeAddress";
import SelectPreset from "./SelectPreset";
import SolidDatePicker from "./SolidDatePicker";
import SolidTimePicker from "./SolidTimePicker";
import { ListToggle, RewardsToggle } from "./Toggle";

import { useGlobalContext } from "../context/store";
import { graphqlClient } from "../utils/graphqlClient";
import {
  getBlocksProposed,
  getBlocksProposedWithRewards,
  getBlocksList,
  getBlocksListWithRewards,
} from "../utils/graphqlQueries";
import { errorsDetected } from "../utils/validation";
import { createStore } from "solid-js/store";
import {
  convertTime12to24,
  isoToDisplayDate,
  dateToIsoDate,
  saveLocalData,
  restoreLocalData,
  getSplitDates,
  getSplitTime,
  deleteLocalData,
} from "../utils/helperFunctions";

export type FormState = {
  fields: {
    isNFD: boolean;
    nfdAddress: string;
    accountAddress: string;
    preset: boolean;
    presetType: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    getList: boolean;
    getRewards: boolean;
  };
  errors: {
    accountAddress: {
      error: boolean;
      msg: string;
    };
    startDate: {
      error: boolean;
      msg: string;
    };
    startTime: {
      error: boolean;
      msg: string;
    };
    endDate: {
      error: boolean;
      msg: string;
    };
    endTime: {
      error: boolean;
      msg: string;
    };
  };
};

const BlockSearchForm = () => {
  const store: any = useGlobalContext();
  const [t] = useTransContext();
  const currentTimeText = t("form_fields.placeholders.end_time");
  const gmtDate = new Date().toISOString().slice(0, 10);
  const [year, month, day] = gmtDate.split("-").map((n) => parseInt(n));
  const [searching, setSearching] = createSignal(false);

  // Special signals required for solid date and time pickers
  const [startDate, setStartDate] = createSignal<PickerValue>({
    label: "",
    value: {},
  });
  const [startTime, setStartTime] = createSignal<TimeValue>({
    label: "",
    value: {},
  });
  const [endDate, setEndDate] = createSignal<PickerValue>({
    label: isoToDisplayDate(gmtDate),
    value: {
      selectedDateObject: { year: year, month: month - 1, day: day },
    },
  });
  const [endTime, setEndTime] = createSignal<TimeValue>({
    label: "",
    value: { hour: 0, minute: 0, second: 0 },
  });

  // Store for all fields and their errors
  const [formState, setFormState] = createStore<FormState>({
    fields: {
      isNFD: false,
      nfdAddress: "",
      accountAddress: "",
      preset: false,
      presetType: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      getList: false,
      getRewards: false,
    },
    errors: {
      accountAddress: {
        error: false,
        msg: "",
      },
      startDate: {
        error: false,
        msg: "",
      },
      startTime: {
        error: false,
        msg: "",
      },
      endDate: {
        error: false,
        msg: "",
      },
      endTime: {
        error: false,
        msg: "",
      },
    },
  });

  // submit a request for blocks and stuff
  const submit = async (e: any) => {
    e.preventDefault();
    setSearching(true);
    // if preset is selected recalculate the datetime fields
    if (formState.fields.preset) {
      const selectElement = document.getElementById("Select-Preset");
      selectElement.dispatchEvent(new Event("change"));
    }
    // set date and time values into the form state
    setFormState({
      ...formState,
      fields: {
        ...formState.fields,
        startDate: dateToIsoDate(startDate().label),
        startTime: startTime().label,
        endDate: dateToIsoDate(endDate().label),
        endTime:
          endTime().label === currentTimeText
            ? new Date().toISOString().slice(11, 19)
            : endTime().label, // get GMT time if current time
      },
    });

    // Check if any field has errors
    if (!(await errorsDetected(formState, setFormState, t))) {
      // Save form state for the local to support Brave refreshing the page
      saveLocalData(formState.fields);

      // set global state to loading and define if getting list or not
      store.setState({
        results: {
          ...store.state.results,
          isLoading: true,
          getList: formState.fields.getList,
          getRewards: formState.fields.getRewards,
        },
      });

      // Set the graphql variables
      const vars = {
        addy: formState.fields.isNFD
          ? formState.fields.nfdAddress
          : formState.fields.accountAddress,
        start: `${formState.fields.startDate}T${convertTime12to24(
          formState.fields.startTime
        )}.000Z`,
        end: `${formState.fields.endDate}T${convertTime12to24(
          formState.fields.endTime
        )}.000Z`,
      };
      // Make graphql query algonode requests
      try {
        const accountResp: any = await fetch(
          `https://mainnet-api.algonode.cloud/v2/accounts/${vars.addy}?format=json&exclude=all`
        );
        const accountInfo: any = await accountResp.json();

        // Determine the call we need to make to the graphql endpoint
        let queryType = "";
        if (formState.fields.getRewards && !formState.fields.getList) {
          queryType = "GET_REWARDS_ONLY";
        } else if (!formState.fields.getRewards && formState.fields.getList) {
          queryType = "GET_LIST_ONLY";
        } else if (formState.fields.getRewards && formState.fields.getList) {
          queryType = "GET_LIST_AND_REWARDS";
        } else {
          queryType = "GET_TOTALS_ONLY";
        }

        let endPointType = "";
        switch (queryType) {
          case "GET_REWARDS_ONLY":
            endPointType = getBlocksProposedWithRewards;
            break;
          case "GET_LIST_ONLY":
            endPointType = getBlocksList;
            break;
          case "GET_LIST_AND_REWARDS":
            endPointType = getBlocksListWithRewards;
            break;
          case "GET_TOTALS_ONLY":
            endPointType = getBlocksProposed;
            break;
          default:
            endPointType = getBlocksProposed;
            break;
        }

        const blocksResp: any = await graphqlClient.request(endPointType, vars);

        // Loop through the header to grab all the payouts to the blocks the account proposed
        let blockRewards: bigint = 0n;
        if (
          queryType === "GET_REWARDS_ONLY" ||
          queryType === "GET_LIST_AND_REWARDS"
        ) {
          for (let i = 0; i < blocksResp.blocks.nodes.length; i++) {
            if (blocksResp.blocks.nodes[i].header?.pp) {
              blockRewards += BigInt(blocksResp.blocks.nodes[i].header.pp);
            }
          }
        }

        // set all the response data into the global context to display the results
        store.setState({
          results: {
            status: accountInfo.status,
            isNFD: formState.fields.isNFD,
            nfdAddress: formState.fields.isNFD
              ? formState.fields.nfdAddress
              : "",
            accountAddress: formState.fields.accountAddress,
            startDateTime: `${isoToDisplayDate(
              formState.fields.startDate
            )} ${convertTime12to24(formState.fields.startTime)} GMT`,
            endDateTime: `${isoToDisplayDate(
              formState.fields.endDate
            )} ${convertTime12to24(formState.fields.endTime)} GMT`,
            blocksProposed: `${blocksResp.blocks.totalCount}`,
            hasResults: true,
            getList: formState.fields.getList,
            getRewards: formState.fields.getRewards,
            rewards: blockRewards,
            blockList: blocksResp?.blocks?.nodes || [],
            isLoading: false,
          },
        });
      } catch (error) {
        // Handle server error
        console.log(error);
      }
    }
    // Turn off searching flag
    setSearching(false);
  };

  // Used to update end time
  createEffect(() => {
    setEndTime({
      label: t("form_fields.placeholders.end_time"),
      value: { hour: 0, minute: 0, second: 0 },
    });
  });

  onMount(() => {
    // check to see if a navigation of type back_forward was triggered
    const entry = window.performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;
    const type: string = entry.type;
    if (type === "back_forward") {
      // a back_forward was triggered restore the form state from local storage
      const localForm = restoreLocalData();

      // restore the form state
      setFormState({
        fields: localForm ? localForm : formState.fields,
      });

      // Next we'll check if the restore type is preset or custom for date/time
      if (localForm.preset) {
        const selectElement = document.getElementById(
          "Select-Preset"
        ) as HTMLSelectElement;
        selectElement.value = localForm.presetType;
        selectElement.dispatchEvent(new Event("change"));
      } else {
        // restore date/time state for start and end
        let [year, month, day] = getSplitDates(localForm.startDate);
        setStartDate({
          label: isoToDisplayDate(localForm.startDate),
          value: {
            selectedDateObject: { year: year, month: month - 1, day: day },
          },
        });
        let [hour, minute, second] = getSplitTime(localForm.startTime);
        setStartTime({
          label: localForm.startTime,
          value: { hour: hour, minute: minute, second: second ? second : 0 },
        });

        [year, month, day] = getSplitDates(localForm.endDate);
        setEndDate({
          label: isoToDisplayDate(localForm.endDate),
          value: {
            selectedDateObject: { year: year, month: month - 1, day: day },
          },
        });

        [hour, minute, second] = getSplitTime(localForm.endTime);
        setEndTime({
          label: localForm.endTime,
          value: { hour: hour, minute: minute, second: second ? second : 0 },
        });
      }
    } else {
      // delete the local state data if not back_forward type
      deleteLocalData();
    }
  });

  return (
    <section class="mx-auto w-full p-4 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-100">
      <div class="mx-auto sm:max-w-3xl pb-5 border-b border-gray-600">
        <form onSubmit={submit} class="">
          <fieldset
            disabled={searching()}
            class="mx-auto mb-0 mt-4 sm:mt-8 space-y-4"
          >
            <NodeAddress state={formState} setState={setFormState} />
            <SelectPreset
              setStartDate={setStartDate}
              setStartTime={setStartTime}
              setEndDate={setEndDate}
              setEndTime={setEndTime}
              state={formState}
              setState={setFormState}
            />
            <div class="flex justify-center text-sm">
              <span class="font-semibold">{t("form_fields.note1")}</span>
              {t("form_fields.note2")}
            </div>
            <fieldset
              disabled={formState.fields.preset}
              class={`${
                formState.fields.preset && "opacity-60"
              } mx-auto mb-0 mt-4 sm:mt-8 space-y-4`}
            >
              <h4 class="flex justify-center">
                {t("form_fields.start_date_time")}
              </h4>
              <div class="flex flex-row gap-4 h-[3rem]">
                <SolidDatePicker
                  state={startDate}
                  setState={setStartDate}
                  errors={formState.errors.startDate}
                />
                <SolidTimePicker
                  state={startTime}
                  setState={setStartTime}
                  errors={formState.errors.startTime}
                />
              </div>
              <h4
                class={`flex justify-center ${
                  formState.errors.startDate.error ||
                  formState.errors.startTime.error
                    ? "pt-6 sm:pt-2"
                    : ""
                }`}
              >
                {t("form_fields.end_date_time")}
              </h4>
              <div class="flex flex-row gap-4 h-[3rem]">
                <SolidDatePicker
                  state={endDate}
                  setState={setEndDate}
                  errors={formState.errors.endDate}
                />
                <SolidTimePicker
                  state={endTime}
                  setState={setEndTime}
                  errors={formState.errors.endTime}
                />
              </div>
            </fieldset>
            <div class="flex flex-row items-center">
              <RewardsToggle state={formState} setState={setFormState} />
              <span class="px-3">{t("form_fields.get_rewards")}</span>
            </div>

            <div class="flex flex-row items-center">
              <ListToggle state={formState} setState={setFormState} />
              <span class="px-3">{t("form_fields.get_last_10")}</span>
            </div>

            <div class="flex items-center justify-between">
              <button
                type="submit"
                aria-busy={searching()}
                disabled={searching()}
                class={`${
                  searching() ? "cursor-not-allowed opacity-50" : ""
                } inline-block w-full rounded-lg !bg-blue-400 dark:!bg-blue-500 
                px-5 py-3 font-medium text-white sm:w-[12rem]`}
              >
                {searching()
                  ? t("form_fields.searching_button")
                  : t("form_fields.search_button")}
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </section>
  );
};

export default BlockSearchForm;
