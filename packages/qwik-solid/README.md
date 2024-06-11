# qwik-solid ⚡️

QwikSolid allows adding Solid components into existing Qwik application

## How to Integrate into a Qwik app

Integration is pretty much the same as <https://qwik.builder.io/docs/integrations/react/>.

First, install `@mechairoi/qwik-solid` with npm, pnpm or yarn.

solid.tsx

```tsx
import { qwikify$ } from '@mechairoi/qwik-solid';

// import Solid component from other package
import { Motion } from 'solid-motionone';

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


Please keep in mind that this is an experimental implementation based on `qwik-react`. So, there might be bugs and unwanted behaviours.

Thanks to https://github.com/BuilderIO/qwik/pull/2291, it has been incredibly helpful.
