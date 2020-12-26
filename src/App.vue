<template>
  <div class="min-h-screen flex">
    <nav class="bg-gray-50 px-4 py-2 w-72">
      <header class="py-4 text-xl text-center">
        <h1>Peripheral notes experiment</h1>
      </header>

      <NotePreviewList />
    </nav>

    <main class="flex-1 p-4">
      <FocusedNotes />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import FocusedNotes from './components/FocusedNotes.vue';
import NotePreviewList from './components/NotePreviewList.vue';
</script>
