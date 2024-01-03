import {
  component$,
  implicit$FirstArg,
  type NoSerialize,
  noSerialize,
  type QRL,
  useTask$,
  SkipRender,
  useSignal,
  Slot,
  RenderOnce,
  useStylesScoped$,
} from '@builder.io/qwik';
import { isBrowser, isServer } from '@builder.io/qwik/build';
import type { Component, JSX } from 'solid-js';
import { createStore } from 'solid-js/store';
import { hydrate, render } from 'solid-js/web';
import { renderFromServer } from './server-render';
import { getHostProps, getSolidProps, mainExactProps, useWakeupSignal } from './slot';
import type { Internal, QwikifyOptions, QwikifyProps } from './types';

export function qwikifyQrl<PROPS extends {}>(
  solidCmp$: QRL<Component<PROPS & { children?: JSX.Element }>>,
  opts?: QwikifyOptions
) {
  return component$<QwikifyProps<PROPS>>((props) => {
    const { scopeId } = useStylesScoped$(
      `q-slot{display:none} q-slotc,q-slotc>q-slot{display:contents}`
    );
    const hostRef = useSignal<Element>();
    const slotRef = useSignal<Element>();
    const internalState = useSignal<NoSerialize<Internal<PROPS>>>();
    const [signal, isClientOnly] = useWakeupSignal(props, opts);
    const hydrationKeys = {};
    const TagName = opts?.tagName ?? ('qwik-solid' as any);
    const hydrated = useSignal<boolean>(false);

    useTask$(({ track, cleanup }) => {
      track(hydrated);
      if (!isBrowser) {
        return;
      }
      if (hydrated.value) {
        cleanup(() => {
          if (internalState.value) {
            internalState.value.dispose?.();
            internalState.value.dispose = undefined;
          }
        });
      }
    });

    // Task takes cares of updates and partial hydration
    useTask$(async ({ track }) => {
      const trackedProps = track(() => ({ ...props }));
      track(signal);

      if (!isBrowser) {
        return;
      }

      // Update
      if (internalState.value) {
        if (internalState.value.dispose) {
          internalState.value.setQwikifyProps(trackedProps);
        }
      } else {
        let dispose: (() => void) | undefined = undefined;
        const Cmp = await solidCmp$.resolve();
        const hostElement = hostRef.value;
        const [wrappedProps, setProps] = createStore<PROPS>({} as PROPS);
        const setQwikifyProps = (props: QwikifyProps<PROPS>) => setProps(getSolidProps(props));

        if (hostElement) {
          // hydration
          if (isClientOnly) {
            setQwikifyProps(trackedProps);
            dispose = render(
              () => mainExactProps(slotRef.value, scopeId, Cmp, wrappedProps),
              hostElement
            );
            hydrated.value = true;
          } else {
            setProps(hydrationKeys as PROPS);

            // Prepare global object expected by Solid's hydration logic
            if (!(globalThis as any)._$HY) {
              (globalThis as any)._$HY = { events: [], completed: new WeakSet(), r: {} };
            }

            dispose = hydrate(
              () => mainExactProps(slotRef.value, scopeId, Cmp, wrappedProps),
              hostElement
            );
            hydrated.value = true;
          }

          if (isClientOnly || signal.value === false) {
            setQwikifyProps(trackedProps);
          }
        }

        internalState.value = noSerialize({
          cmp: Cmp,
          dispose,
          setQwikifyProps,
          wrappedProps,
        });
      }
    });

    if (isServer && !isClientOnly) {
      const jsx = renderFromServer(
        TagName,
        solidCmp$,
        scopeId,
        props,
        hostRef,
        slotRef,
        hydrationKeys
      );
      return <RenderOnce>{jsx}</RenderOnce>;
    }

    return (
      <RenderOnce>
        <TagName
          {...getHostProps(props)}
          ref={
            scopeId /* workaround to prevent _IMMUTABLE */ &&
            ((el: Element) => {
              if (isBrowser) {
                queueMicrotask(() => {
                  const internalData = internalState.value;

                  if (internalData && !internalData.dispose) {
                    internalData.setQwikifyProps(props);
                    internalData.dispose = render(
                      () =>
                        mainExactProps(
                          slotRef.value,
                          scopeId,
                          internalData.cmp,
                          internalData.wrappedProps
                        ),
                      el
                    );
                    hydrated.value = true;
                  }
                });
              } else {
                hostRef.value = el;
              }
            })
          }
        >
          {SkipRender}
        </TagName>
        <q-slot ref={slotRef}>
          <Slot></Slot>
        </q-slot>
      </RenderOnce>
    );
  });
}

export const qwikify$ = /*#__PURE__*/ implicit$FirstArg(qwikifyQrl);
