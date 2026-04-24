<template>
  <AppCard class="max-w-2xl">
    <SectionHeader
      title="Receipt confirmation"
      description="Receipt detail rendering is placeholder-only, but the collector confirmation state is in place."
    />
    <div class="mt-6">
      <AppButton @click="router.push('/collector/history')">
        View recent collections
      </AppButton>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppButton from '@/shared/components/buttons/AppButton.vue'
import AppCard from '@/shared/components/cards/AppCard.vue'
import SectionHeader from '@/shared/components/headers/SectionHeader.vue'

const router = useRouter()
</script>
