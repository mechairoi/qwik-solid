# qwik-solid ⚡️

QwikSolid allows adding Solid components into existing Qwik application

## How to Integrate into a Qwik app

Integration is pretty much the same as <https://qwik.builder.io/docs/integrations/react/>.

First, install `@mechairoi/qwik-solid` with npm, pnpm or yarn. Instead of `react` and `react-dom`, you will need to install `solid-js` and `vite-plugin-solid`. And don't forgot `/** @jsxImportSource solid-js */`

solid.tsx

```tsx
/** @jsxImportSource solid-js */
import { qwikify$ } from '@qwikdev/qwik-solid';
import { createSignal } from 'solid-js';

// Create Solid component standard way
function Counter() {
  const [count, setCount] = createSignal(0);
  return (
    <button onClick={() => setCount((count) => count + 1)}>
      Count: {count}
    </button>
  );
}

// Convert Solid component to Qwik component
export const QCounter = qwikify$(Counter, { eagerness: 'hover' });
```

index.tsx

```tsx
import { component$ } from '@builder.io/qwik';
import { QCounter } from './solid';

export default component$(() => {
  return (
    <main>
      <QCounter />
    </main>
  );
});
```

vite.config.ts

```ts
// vite.config.ts
import { qwikSolid } from '@mechairoi/qwik-solid/vite';
import { solid } from 'vite-plugin-solid';

export default defineConfig(() => {
   return {
     ...,
     plugins: [
       // `vite-plugin-solid` must be placed before `qwikCity` and `qwikVite`
       solid({ include:'./src/integrations/solid/**', ssr: true }),
       qwikCity(),
       qwikVite({
        // The default `entryStrategy: smart` does not transform jsx of solid at build time, so you must specify this.
        entryStrategy:
          config.command === "build" || config.command === "serve"
            ? { type: config.isSsrBuild ? "hoist" : "hook" }
            : undefined,
      }),
       qwikSolid(),
     ],
   };
});
```

Please keep in mind that this is an experimental implementation based on `qwik-react`. So, there might be bugs and unwanted behaviours.

Thanks to https://github.com/BuilderIO/qwik/pull/2291, it has been incredibly helpful.
