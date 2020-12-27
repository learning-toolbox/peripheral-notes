<template>
  <button class="h-8 w-8" @click="$emit('update:expanded', !props.expanded)">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
      <path
        v-if="props.expanded"
        d="M11 16V12M11 12H15M11 12L15 16M7 16V12M7 12H3M7 12L3 16M11 4V8M11 8H15M11 8L15 4M7 8L3 4M7 8V4M7 8H3"
        stroke="#374151"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        v-else
        stroke="#374151"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M3 8V4m0 0h4M3 4l4 4m8 0V4m0 0h-4m4 0l-4 4m-8 4v4m0 0h4m-4 0l4-4m8 4l-4-4m4 4v-4m0 4h-4"
      />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
  expanded: { required: true, type: Boolean },
});
</script>
