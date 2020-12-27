<template>
  <div class="relative h-full w-full max-h-full max-w-full">
    <Note v-for="note in focusedNotes" :id="note.id" :key="note.id" :position="note.position" />
  </div>
</template>

<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import Note from './Note.vue';
import { usePeripheralMachine } from '../composables/use-peripheral-machine';

const { state, send } = usePeripheralMachine();

// sort the notes so that they do not move as their position changes. This will allow transitions to work
const focusedNotes = computed(() =>
  Object.entries(state.value.context.focusedNotes)
    .map(([position, id]) => ({
      id: id!,
      position,
    }))
    .sort(({ id: id1 }, { id: id2 }) => id1.localeCompare(id2!))
);
</script>
