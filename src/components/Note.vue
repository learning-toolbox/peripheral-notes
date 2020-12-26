<template>
  <div
    class="absolute h-96 w-96 shadow-lg rounded-md transition-all duration-300 origin-center"
    :style="styles"
  >
    <!-- TODO: throttle input event listener -->
    <textarea
      :value="note.markdown"
      spellcheck
      class="h-full w-full rounded-md p-2 bg-white resize-none border-2 border-gray-300"
      @input="debounceInput(id, $event.target.value)"
    ></textarea>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, defineEmit, computed, watchEffect, onUnmounted, onMounted } from 'vue';
import { debounce } from 'lodash-es';
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
  dimensions: {
    required: true,
    type: Object,
  },
});

const { state, send } = usePeripheralMachine();

const note = computed(() => state.value.context.notes[props.id]);

const styles = computed(() => {
  const { height, width } = props.dimensions;

  switch (props.position) {
    case 'center':
      return `transform: translate(${width / 2}px, ${
        height / 2
      }px); transform-origin: center center;`;
    case 'topLeft':
      return `transform: scale(0.75);`;
    case 'topRight':
      return `transform: translate(${width}px, 0px) scale(0.75);`;
    case 'bottomRight':
      return `transform: translate(${width}px, ${height}px) scale(0.75);`;
    case 'bottomLeft':
      return `transform: translate(0px, ${height}px) scale(0.75);`;
  }
});

const debounceInput = debounce((id: string, markdown: string) => {
  send({ type: 'TYPING', id, markdown });
}, 100);

onUnmounted(() => {
  debounceInput.cancel();
});
</script>
