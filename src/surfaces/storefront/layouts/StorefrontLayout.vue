<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center pt-20">
    <div class="w-full max-w-2xl px-4">
      <div class="text-center mb-10">
        <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight">
          Support Our Cause
        </h1>
        <p class="mt-4 text-lg text-gray-500">
          Choose a recipient fund below to make a contribution.
        </p>
      </div>

      <AppCard class="mb-6">
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Select a Fund
          </h3>
          <AppSelect
            id="fund"
            v-model="selectedFund"
            :options="[{ value: '', label: 'Select a fund...' }, { value: '1', label: 'Local Food Bank' }]"
          />
          <div class="mt-6">
            <AppButton
              size="lg"
              class="w-full"
            >
              Contribute Now
            </AppButton>
          </div>
        </div>
      </AppCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppCard from '../../../shared/components/ui/AppCard.vue'
import AppButton from '../../../shared/components/ui/AppButton.vue'
import AppSelect from '../../../shared/components/ui/AppSelect.vue'

const selectedFund = ref('')
</script>
