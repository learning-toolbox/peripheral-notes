<template>
  <div
    class="absolute h-96 w-96 shadow-lg bg-white rounded-md transition-all duration-500"
    :style="styles"
  >
    <ExpandButton
      v-if="centered"
      :expanded="expanded"
      class="absolute top-0 right-0"
      @update:expanded="onExpanded"
    />

    <div
      ref="el"
      v-html="note.markdown"
      :contenteditable="centered"
      :class="expanded ? 'border-0' : 'border-2'"
      :style="
        expanded
          ? 'padding-left: calc((100% - 64ch) / 2); padding-right: calc((100% - 64ch) / 2);'
          : ''
      "
      class="h-full w-full rounded-md px-4 pt-8 resize-none border-gray-300 overflow-y-scroll"
      @input="debounceInput($event)"
      @click="onFocus"
    ></div>
  </div>
</template>

<script setup lang="ts">
import {
  defineProps,
  ref,
  defineEmit,
  computed,
  watchEffect,
  onUnmounted,
  watch,
  nextTick,
} from 'vue';
import { debounce } from 'lodash-es';
import ExpandButton from './ExpandButton.vue';
import { usePeripheralMachine } from '../composables/use-peripheral-machine';

const props = defineProps({
  id: {
    required: true,
    type: String,
  },
  position: {
    required: true,
    type: String,
  },
});

const el = ref<HTMLElement | null>(null);
const expanded = ref(false);

const { state, send } = usePeripheralMachine();

const note = computed(() => state.value.context.notes[props.id]);

const centered = computed(() => props.position === 'center');

const styles = computed(() => {
  switch (props.position) {
    case 'center': {
      if (expanded.value) {
        return `top: -1rem; left: -1rem; height: calc(100% + 2rem); width: calc(100% + 2rem); z-index: 2; box-shadow: none; border-width: 0;`;
      }
      return `top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 2;`;
    }
    case 'topLeft':
      return `top: 0; left: 0; transform: scale(0.75); transform-origin: top left;`;
    case 'topRight':
      return `top: 0; left: 100%; transform: translateX(-100%) scale(0.75); transform-origin: top right;`;
    case 'bottomRight':
      return `top: 100%; left: 100%; transform: translate(-100%, -100%) scale(0.75); transform-origin: bottom right;`;
    case 'bottomLeft':
      return `top: 100%; left: 0; transform: translateY(-100%) scale(0.75); transform-origin: bottom left;`;
  }
});

watch(
  () => props.position,
  () => {
    expanded.value = false;
  }
);

const debounceInput = debounce((event: InputEvent) => {
  console.log(event, document.getSelection());
  // send({ type: 'TYPING', id: props.id, markdown });
}, 100);

onUnmounted(() => {
  debounceInput.cancel();
});

function onFocus() {
  if (!centered.value) {
    send({ type: 'FOCUS', id: props.id });
  }
}

// Focus the editor after expandinf or collapsing
function onExpanded(event: boolean) {
  expanded.value = event;
  nextTick(() => {
    el.value?.focus();
  });
}
</script>
