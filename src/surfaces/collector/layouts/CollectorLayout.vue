<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <AppCard class="max-w-md w-full text-center">
      <h2 class="text-2xl font-bold mb-2">
        Collector Dashboard
      </h2>
      <p class="text-gray-500 mb-6">
        You have 2 assigned events today.
      </p>
      <AppButton
        size="lg"
        class="w-full"
      >
        Start Cash Collection
      </AppButton>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import AppCard from '../../../shared/components/ui/AppCard.vue'
import AppButton from '../../../shared/components/ui/AppButton.vue'
</script>
