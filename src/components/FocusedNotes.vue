<template>
  <div v-resize="onResize" class="relative h-full w-full">
    <Note
      v-for="(id, position) in focusedNotes"
      :id="id"
      :key="id"
      :position="position"
      :dimensions="dimensions"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import Note from './Note.vue';
import { usePeripheralMachine } from '../composables/use-peripheral-machine';
import { directive as resize } from '../utils/resize';

const { state, send } = usePeripheralMachine();

const dimensions = shallowRef({ height: 0, width: 0 });

const focusedNotes = computed(() => state.value.context.focusedNotes);

function onResize({ height, width }: any) {
  dimensions.value = { height, width };
}
</script>
