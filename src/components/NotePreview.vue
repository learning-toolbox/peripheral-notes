<template>
  <div
    :class="{ 'bg-gray-200': isNoteFocued }"
    class="p-2 rounded-lg hover:bg-gray-300 focus:bg-gray-300"
    tabindex="0"
    @click="send({ type: 'FOCUS', id })"
  >
    <h2>{{ note.title }}</h2>
    <p class="text-sm text-gray-500">{{ note.preview }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue';
import { usePeripheralMachine } from '../composables/use-peripheral-machine';

const props = defineProps({
  id: { required: true, type: String },
});

const { state, send } = usePeripheralMachine();

const isNoteFocued = computed(() => props.id === state.value.context.focusedNotes.center);

const previewLength = 40;

const note = computed(() => {
  const { markdown } = state.value.context.notes[props.id];
  const endOfFirstLine = markdown.indexOf('\n');
  const title = markdown.slice(0, endOfFirstLine).replace('#', '');
  const body = markdown.slice(endOfFirstLine);

  return {
    title,
    preview: body.length >= previewLength ? `${body.slice(0, previewLength)}...` : body,
  };
});
</script>
