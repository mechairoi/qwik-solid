import { $, useOn, useOnDocument, useSignal } from '@builder.io/qwik';
import { isServer } from '@builder.io/qwik/build';
import { createContext, onMount, sharedConfig, useContext } from 'solid-js';
import {
  createComponent,
  mergeProps,
  ssr,
  ssrHydrationKey,
  ssrAttribute,
  escape,
  effect,
  className,
  template,
} from 'solid-js/web';
import type { QwikifyOptions, QwikifyProps } from './types';

interface SlotState {
  el?: Element;
  scopeId: string;
  attachedEl?: Element;
}
const SlotCtx = createContext<SlotState>({ scopeId: '' });

export function mainExactProps(
  slotEl: Element | undefined,
  scopeId: string,
  RootCmp: any,
  props: any
) {
  return createComponent(SlotCtx.Provider, {
    value: {
      el: slotEl,
      scopeId,
      attachedEl: undefined,
    },
    get children() {
      return createComponent(
        RootCmp,
        mergeProps(props, {
          get children() {
            return createComponent(SlotElement as (props: {}) => Element, {});
          },
        })
      );
    },
  });
}

const _tmpl$ = isServer ? (undefined as never) : template(`<q-slotc><!--SLOT-->`);

const SlotElement = () => {
  const context = useContext(SlotCtx);
  let slotC: Element | undefined;

  onMount(() => {
    if (slotC) {
      const { attachedEl, el } = context;
      if (el) {
        if (!attachedEl) {
          slotC.appendChild(el);
        } else if (attachedEl !== slotC) {
          throw new Error('already attached');
        }
      }
    }
  });

  // Solid components are compiled differently for server and client
  return isServer
    ? ssr(
        ['<q-slotc', '', '><!--SLOT--></q-slotc>'],
        ssrHydrationKey(),
        // @ts-expect-error
        ssrAttribute('class', escape(context.scopeId, true), false)
      )
    : (() => {
        if (sharedConfig.context) {
          return context.el?.querySelector('q-slotc');
        } else {
          const _el$ = _tmpl$();
          slotC = _el$;
          effect(() => className(_el$, context.scopeId));
          return _el$;
        }
      })();
};

export const getSolidProps = <PROPS extends {}>(props: QwikifyProps<PROPS>): PROPS => {
  const obj: any = {};
  Object.keys(props).forEach((key) => {
    if (!key.startsWith('client:') && !key.startsWith(HOST_PREFIX)) {
      const normalizedKey = key.endsWith('$') ? key.slice(0, -1) : key;
      obj[normalizedKey] = props[key as keyof QwikifyProps<PROPS>];
    }
  });
  return obj;
};

export const getHostProps = (props: Record<string, any>): Record<string, any> => {
  const obj: Record<string, any> = {};
  Object.keys(props).forEach((key) => {
    if (key.startsWith(HOST_PREFIX)) {
      obj[key.slice(HOST_PREFIX.length)] = props[key];
    }
  });
  return obj;
};

export const useWakeupSignal = (props: QwikifyProps<{}>, opts: QwikifyOptions = {}) => {
  const signal = useSignal(false);
  const activate = $(() => (signal.value = true));
  const clientOnly = !!(props['client:only'] || opts?.clientOnly);
  if (isServer) {
    if (props['client:visible'] || opts?.eagerness === 'visible') {
      useOn('qvisible', activate);
    }
    if (props['client:idle'] || opts?.eagerness === 'idle') {
      useOnDocument('qidle', activate);
    }
    if (props['client:load'] || clientOnly || opts?.eagerness === 'load') {
      useOnDocument('qinit', activate);
    }
    if (props['client:hover'] || opts?.eagerness === 'hover') {
      useOn('mouseover', activate);
    }
    if (props['client:event']) {
      useOn(props['client:event'], activate);
    }
    if (opts?.event) {
      useOn(opts?.event, activate);
    }
  }
  return [signal, clientOnly, activate] as const;
};

const HOST_PREFIX = 'host:';
