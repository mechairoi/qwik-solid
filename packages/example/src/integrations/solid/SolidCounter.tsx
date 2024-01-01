/** @jsxImportSource solid-js */

import { qwikify$ } from "@mechairoi/qwik-solid";
import { createSignal } from "solid-js";
import type { JSX, ParentProps } from "solid-js";

function SolidCounter_(props: ParentProps): JSX.Element {
  const [count, setCount] = createSignal(0);

  return (
    <>
      <section>
        <h2>Qwik + Solid</h2>
        <div>{props.children}</div>
        <div>
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count()}
          </button>
          <p>
            Edit <code>src/integrations/solid/SolidCounter.tsx</code> and save
            to test HMR
          </p>
          <p></p>
        </div>
      </section>
    </>
  );
}

export const SolidCounter = qwikify$(SolidCounter_);
