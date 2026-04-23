<template>
  <div class="rounded-md bg-red-50 p-4">
    <div class="flex">
      <div class="flex-shrink-0">
        <!-- Error Icon -->
        <svg
          class="h-5 w-5 text-red-400"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
      <div class="ml-3">
        <h3 class="text-sm font-medium text-red-800">
          {{ title }}
        </h3>
        <div
          v-if="message || errors"
          class="mt-2 text-sm text-red-700"
        >
          <p v-if="message">
            {{ message }}
          </p>
          <ul
            v-if="errors && errors.length > 0"
            role="list"
            class="list-disc space-y-1 pl-5 mt-1"
          >
            <li
              v-for="(error, index) in errors"
              :key="index"
            >
              {{ error }}
            </li>
          </ul>
        </div>
        <div
          v-if="$slots.action"
          class="mt-4"
        >
          <div class="-mx-2 -my-1.5 flex">
            <slot name="action" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  message?: string
  errors?: string[]
}>()
</script>
