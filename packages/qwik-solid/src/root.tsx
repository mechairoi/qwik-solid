import { component$, useSignal } from '@builder.io/qwik';
import { MotionButton } from './examples/app';

export const Root = component$(() => {
  const bg = useSignal('red');

  return (
    <>
      <head>
        <meta charSet="utf-8" />
        <title>Qwik Blank App</title>
      </head>
      <body>
        <MotionButton
          client:hover
          onClick$={() => {
            bg.value = 'blue';
          }}
          animate={{ backgroundColor: bg.value }}
          transition={{ duration: 1 }}
        >
          Click Me (bg.value = {bg.value})
        </MotionButton>
      </body>
    </>
  );
});
