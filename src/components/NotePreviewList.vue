<template>
  <ul>
    <li v-for="(id, i) in noteIds" :key="id">
      <NotePreview :id="id" />
      <hr v-if="i !== noteIds.length - 1" class="my-4" />
    </li>
  </ul>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import NotePreview from './NotePreview.vue';
import { usePeripheralMachine } from '../composables/use-peripheral-machine';

const { state, send } = usePeripheralMachine();

const noteIds = computed(() => Object.keys(state.value.context.notes));
</script>
