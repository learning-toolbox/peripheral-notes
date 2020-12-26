import { throttle } from 'lodash-es';
import { Directive } from 'vue';

export type ResizeDimensions = {
  width: number;
  height: number;
  target: Element;
};

export type ResizeCallback = {
  (dimensions: ResizeDimensions): void;
  cancel?: () => void;
};

const resizeCallbacks = new Map<Element, ResizeCallback>();

const ro = new ResizeObserver((entries) => {
  for (const { target, contentRect } of entries) {
    resizeCallbacks.get(target)?.({
      target,
      height: contentRect.height,
      width: contentRect.width,
    });
  }
});

export function observe(
  element: Element,
  callback: ResizeCallback,
  options?: ResizeObserverOptions
) {
  if (resizeCallbacks.has(element)) {
    throw new Error('You can only observe a element once.');
  }

  resizeCallbacks.set(element, throttle(callback, 75));

  ro.observe(element, options);
}

export function unobserve(element: Element) {
  ro.unobserve(element);

  const callback = resizeCallbacks.get(element);
  callback?.cancel?.();

  resizeCallbacks.delete(element);
}

export const directive: Directive<Element, ResizeCallback> = {
  mounted(el, { value }) {
    observe(el, value);
  },
  unmounted(el) {
    unobserve(el);
  },
};
