<template>
  <AppCard>
    <SectionHeader
      title="Assigned event detail"
      description="Lightweight placeholder to keep event context handy before recording a contribution."
    />
    <div class="mt-6">
      <AppButton @click="router.push('/collector/contributions/new')">
        Record cash contribution
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
