import { component$, useSignal } from "@builder.io/qwik";
import { SolidCounter } from "~/integrations/solid/SolidCounter";

export default component$(() => {
  const counter = useSignal(0);

  return (
    <div>
      <button
        onClick$={() => {
          counter.value++;
        }}
      >
        Qwik count up button
      </button>
      <div>
        <h1>client:idle</h1>
        <SolidCounter client:idle>
          Qwik counter value is {counter.value}
        </SolidCounter>
      </div>
      <div>
        <h1>client:only</h1>
        <SolidCounter client:only>
          Qwik counter value is {counter.value}
        </SolidCounter>
      </div>
      <div>
        <h1>client:hover</h1>
        <SolidCounter client:hover>
          Qwik counter value is {counter.value}
        </SolidCounter>
      </div>
    </div>
  );
});
